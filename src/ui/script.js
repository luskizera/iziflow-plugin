document.getElementById("generateButton").onclick = () => {
  const jsonInput = document.getElementById("jsonInput").value;

  try {
    const parsedJSON = JSON.parse(jsonInput); // Validação básica
    console.log("Enviando JSON para o plugin:", parsedJSON); // Verificar se está enviando o JSON

    parent.postMessage(
      {
        pluginMessage: {
          type: "generate-flow",
          json: JSON.stringify(parsedJSON),
        },
      },
      "*"
    );
  } catch (error) {
    alert("JSON inválido! Corrija o erro e tente novamente.");
  }
};
