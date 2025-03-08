import { Project, SourceFile } from "ts-morph";

/**
 * Adiciona imports e exports necessários aos arquivos TypeScript
 */
export function processImportsExports() {
    // Inicializa o projeto
    const project = new Project({
        tsConfigFilePath: "tsconfig.json"
    });

    console.log("🔄 Iniciando processamento de imports/exports...");

    // Obtém todos os arquivos fonte
    const sourceFiles = project.getSourceFiles();
    
    // Processa cada arquivo
    for (const sourceFile of sourceFiles) {
        console.log(`📝 Processando arquivo: ${sourceFile.getFilePath()}`);
        addImports(sourceFile);
        addExports(sourceFile);
    }

    // Salva as alterações
    project.saveSync();
    console.log("✅ Processamento concluído com sucesso!");
}

function addImports(sourceFile: SourceFile) {
    const importDeclarations = sourceFile.getImportDeclarations();
    const hasHexToRGBImport = importDeclarations.some(imp => 
        imp.getNamedImports().some(namedImp => namedImp.getName() === "hexToRGB")
    );

    if (!hasHexToRGBImport) {
        sourceFile.addImportDeclaration({
            moduleSpecifier: "utils/colors",
            namedImports: ["hexToRGB"]
        });
        console.log(`✅ Adicionado import para 'hexToRGB' em ${sourceFile.getFilePath()}`);
    }
}

function addExports(sourceFile: SourceFile) {
    const functions = sourceFile.getFunctions();
    functions.forEach(func => {
        if (!func.isExported()) {
            func.setIsExported(true);
            console.log(`✅ Exportada função ${func.getName()} em ${sourceFile.getFilePath()}`);
        }
    });
}
