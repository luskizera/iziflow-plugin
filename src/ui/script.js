document.getElementById("generateButton").onclick = () => {
  const jsonInput = document.getElementById("jsonInput");
  if (jsonInput instanceof HTMLTextAreaElement) {
    try {
      const json = JSON.parse(jsonInput.value);
      parent.postMessage({ pluginMessage: { type: "generate-flow", json: JSON.stringify(json) } }, "*");
    } catch (error) {
      alert("JSON inválido! Verifique o formato.");
    }
  }
};

console.log("UI carregada com sucesso!");