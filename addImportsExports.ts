import { Project, SourceFile, VariableDeclarationKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "F:/Design/Plugin Figma/iziflow-plugin/tsconfig.json",
});

const sourceFiles = project.getSourceFiles();

sourceFiles.forEach((sourceFile) => {
  console.log(`Processing file: ${sourceFile.getFilePath()}`);

  // Adiciona imports
  addImports(sourceFile);

  // Adiciona exports
  addExports(sourceFile);
});

project.saveSync();
console.log("Imports and exports added successfully!");

function addImports(sourceFile: SourceFile) {
  // Adicione suas regras de importação aqui
  // Exemplo: Adiciona importação para 'hexToRGB' se não existir
  const importDeclarations = sourceFile.getImportDeclarations();
  const hasHexToRGBImport = importDeclarations.some((imp) =>
    imp.getNamedImports().some((namedImp) => namedImp.getName() === "hexToRGB")
  );

  if (!hasHexToRGBImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "utils/colors",
      namedImports: ["hexToRGB"],
    });
    console.log(`Added import for 'hexToRGB' in ${sourceFile.getFilePath()}`);
  }
}

function addExports(sourceFile: SourceFile) {
  // Adicione suas regras de exportação aqui
  // Exemplo: Adiciona exportação para todas as funções no arquivo
  const functions = sourceFile.getFunctions();
  functions.forEach((func) => {
    if (!func.isExported()) {
      func.setIsExported(true);
      console.log(`Exported function '${func.getName()}' in ${sourceFile.getFilePath()}`);
    }
  });
}