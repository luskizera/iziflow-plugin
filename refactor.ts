import { Project, SourceFile, ModuleDeclaration, SyntaxKind, Node } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "F:/Design/Plugin Figma/iziflow-plugin/tsconfig.json",
});

const sourceFiles = project.getSourceFiles();
console.log(`Total de arquivos encontrados: ${sourceFiles.length}`);

function refactorNamespaceToModule(ns: ModuleDeclaration, sourceFile: SourceFile) {
  console.log(`Processando namespace: ${ns.getName()}`);
  const exportedDeclarations = ns.getExportedDeclarations();
  console.log(`Declarações exportadas no namespace ${ns.getName()}: ${exportedDeclarations.size}`);

  exportedDeclarations.forEach((declarations: Node[]) => {
    declarations.forEach((declaration: Node) => {
      const kindName = declaration.getKindName();
      console.log(`Processando declaração: ${kindName}`);
      const declarationText = declaration.getText().replace("export ", "");

      // Verifica referências a outros namespaces no texto da declaração
      const referencedNamespaces = new Set<string>();
      declaration.getDescendantsOfKind(SyntaxKind.TypeReference).forEach((typeRef) => {
        const typeName = typeRef.getTypeName()?.getText();
        if (typeName && sourceFiles.some((sf) => {
          const namespaces = sf.getNamespaces() as unknown as ModuleDeclaration[]; // Conversão dupla
          return namespaces?.some((n: ModuleDeclaration) => n.getName() === typeName) || false;
        })) {
          referencedNamespaces.add(typeName);
        }
      });

      try {
        (declaration as any).remove();
        console.log(`Removido: ${kindName}`);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(`Aviso: Não foi possível remover ${kindName} - ${errorMessage}`);
      }
      sourceFile.addStatements(`export ${declarationText}`);
      console.log(`Adicionado export: ${declarationText}`);

      // Adiciona importações para namespaces referenciados
      referencedNamespaces.forEach((nsName) => {
        const nsFile = sourceFiles.find((sf) => {
          const namespaces = sf.getNamespaces() as unknown as ModuleDeclaration[]; // Conversão dupla
          return namespaces?.some((n: ModuleDeclaration) => n.getName() === nsName) || false;
        });
        if (nsFile && nsFile.getFilePath() !== sourceFile.getFilePath()) {
          const relativePath = sourceFile.getRelativePathTo(nsFile).replace(/\.ts$/, "");
          sourceFile.addImportDeclaration({
            moduleSpecifier: relativePath,
            namedImports: [nsName],
          });
          console.log(`Adicionada importação: import { ${nsName} } from "${relativePath}"`);
        }
      });
    });
  });

  if (ns.getExportedDeclarations().size === 0) {
    console.log(`Namespace ${ns.getName()} agora vazio, removendo...`);
    ns.remove();
  } else {
    console.log(`Namespace ${ns.getName()} ainda tem declarações: ${ns.getExportedDeclarations().size}`);
  }
}

sourceFiles.forEach((sourceFile) => {
  console.log(`Analisando arquivo: ${sourceFile.getFilePath()}`);
  const namespaces = sourceFile
    .getStatements()
    .filter((stmt) => stmt.getKind() === SyntaxKind.ModuleDeclaration) as ModuleDeclaration[];

  console.log(`Namespaces encontrados no arquivo: ${namespaces.length}`);
  namespaces.forEach((ns) => {
    console.log(`Namespace encontrado: ${ns.getName()} (exportado: ${ns.hasExportKeyword()})`);
    refactorNamespaceToModule(ns, sourceFile);
  });

  const namespaceImports = sourceFile.getImportDeclarations().filter((imp) =>
    imp.getText().includes("namespace")
  );
  console.log(`Importações com 'namespace': ${namespaceImports.length}`);

  namespaceImports.forEach((imp) => {
    const modulePath = imp.getModuleSpecifierValue();
    const namedImports = imp.getNamedImports();
    namedImports.forEach((namedImp) => {
      const importName = namedImp.getName();
      imp.remove();
      sourceFile.addImportDeclaration({
        moduleSpecifier: modulePath,
        namedImports: [importName],
      });
    });
  });
});

project.saveSync();
console.log("Refatoração concluída!");