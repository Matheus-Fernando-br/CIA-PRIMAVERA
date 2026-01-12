function copiarPix() {
    const chave = "39.926.533/0001-34";

    navigator.clipboard.writeText(chave).then(() => {
      alert("✅ Chave PIX copiada com sucesso!");
    }).catch(() => {
      alert("❌ Erro ao copiar a chave PIX. Tente novamente.");
    });
  }