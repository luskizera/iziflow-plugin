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
      console.log(`Processando declaração: ${declaration.getKindName()}`);
      const declarationText = declaration.getText().replace("export ", "");
      try {
        (declaration as any).remove();
        console.log(`Removido: ${declaration.getKindName()}`);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(`Aviso: Não foi possível remover ${declaration.getKindName()} - ${errorMessage}`);
      }
      sourceFile.addStatements(`export ${declarationText}`);
      console.log(`Adicionado export: ${declarationText}`);
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
    refactorNamespaceToModule(ns, sourceFile); // Processa todos os namespaces, exportados ou não
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