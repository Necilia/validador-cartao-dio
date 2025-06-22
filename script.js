function isValidLuhn(cardNumber) {
    cardNumber = cardNumber.replace(/\D/g, '');

    let sum = 0;
    let double = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);

        if (double) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        double = !double;
    }
    return (sum % 10 === 0);
}

// NOVO: Função para limpar os resultados
function clearResults() {
    const resultadoDiv = document.getElementById("resultado");
    const luhnStatusDiv = document.getElementById("luhnStatus");
    const overallStatusDiv = document.getElementById("overallStatus");

    if (resultadoDiv) {
        resultadoDiv.textContent = '';
        resultadoDiv.classList.remove('valid', 'invalid');
    }
    if (luhnStatusDiv) {
        luhnStatusDiv.textContent = '';
        luhnStatusDiv.classList.remove('valid', 'invalid');
    }
    if (overallStatusDiv) {
        overallStatusDiv.textContent = '';
        overallStatusDiv.classList.remove('valid', 'invalid');
    }
}


function validar() {
  const numero = document.getElementById("numeroCartao").value.replace(/\D/g, '');
  const resultadoDiv = document.getElementById("resultado");
  const luhnStatusDiv = document.getElementById("luhnStatus");
  const overallStatusDiv = document.getElementById("overallStatus");

  // Removido: O if (numero.length === 0) que estava aqui.
  // Agora, a limpeza acontece apenas quando o input está VAZIO.

  let bandeira = "Bandeira não identificada";
  let isLuhnValid = false;
  let isCardValid = false;

  // Estas linhas continuam para garantir que classes de cores sejam removidas antes de re-aplicar
  if (resultadoDiv) resultadoDiv.classList.remove('valid', 'invalid');
  if (luhnStatusDiv) luhnStatusDiv.classList.remove('valid', 'invalid');
  if (overallStatusDiv) overallStatusDiv.classList.remove('valid', 'invalid');

  // Removido: A limpeza de textContent no início da validar().
  // Agora, o conteúdo só será definido OU limpo explicitamente se o input estiver vazio.

  const minLengthForBrandDetection = 6;
  const minLengthForFullValidation = 13;


  // A lógica de "digite mais dígitos" ainda se aplica se o número não estiver vazio mas for curto demais
  if (numero.length < minLengthForBrandDetection && numero.length > 0) {
    if (resultadoDiv) {
        resultadoDiv.textContent = 'Digite mais dígitos para identificar a bandeira.';
        resultadoDiv.classList.add('invalid'); // Pode ser um cinza claro ou algo que indique "alerta"
    }
    if (luhnStatusDiv) luhnStatusDiv.textContent = '';
    if (overallStatusDiv) overallStatusDiv.textContent = '';
    return; // Sai da função, não prossegue com validação completa
  } else if (numero.length === 0) {
      // Se o campo estiver completamente vazio, não faça nada aqui.
      // A função clearResults já tratará disso por fora.
      return;
  }


  // 1. Verificações de Bandeiras (do mais específico para o mais genérico)
  // A ordem é CRÍTICA aqui!

  // Hipercard (6062 - bem específico)
  if (/^6062/.test(numero) && (numero.length >= 13 && numero.length <= 19)) {
    bandeira = "Hipercard";
  }
  // American Express (34, 37 - bem específico, 15 dígitos)
  else if (/^3[47]/.test(numero) && numero.length === 15) {
    bandeira = "American Express";
  }
  // Diners Club (30, 36, 38 - bem específico, 14 dígitos)
  else if (/^3(?:0[0-5]|[68])/.test(numero) && numero.length === 14) {
    bandeira = "Diners Club";
  }
  // Elo (muitos prefixos, verificar antes de bandeiras que podem começar com os mesmos dígitos)
  else if (
      (numero.length >= 13 && numero.length <= 19) &&
      (
          /^(401178|401179|431274|438935|451416|457393|457631|457632)/.test(numero) ||
          /^(504175|5067|509)/.test(numero) ||
          /^(627780|636297|636368|6504|6509|6516|6550)/.test(numero)
      )
  ) {
      bandeira = "Elo";
  }
  // Discover (6011, 65, 644-649 - pode colidir com Elo em 6, por isso Elo antes)
  else if ((/^6011|^65|^64[4-9]/.test(numero)) && (numero.length >= 16 && numero.length <= 19)) {
    bandeira = "Discover";
  }
  // Mastercard (2221-2720, 51-55 - pode colidir com Elo em 5, por isso Elo antes)
  else if ((/^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[01][0-9]|720)/.test(numero) || /^5[1-5]/.test(numero)) && (numero.length >= 16 && numero.length <= 19)) {
    bandeira = "MasterCard";
  }
  // Visa (4 - o mais genérico de todos, por isso por último entre os "conflitantes")
  else if (/^4/.test(numero) && (numero.length >= 13 && numero.length <= 19)) {
    bandeira = "Visa";
  }


  // 2. Validação do Algoritmo de Luhn
  if (bandeira !== "Bandeira não identificada" && numero.length >= minLengthForFullValidation) {
      isLuhnValid = isValidLuhn(numero);
      isCardValid = isLuhnValid;
  } else {
      isLuhnValid = false;
      isCardValid = false;
  }


  // 3. Exibir resultados e aplicar cores
  if (resultadoDiv) {
      resultadoDiv.textContent = `Bandeira: ${bandeira}`;
      resultadoDiv.classList.remove('valid', 'invalid');
      if (bandeira === "Bandeira não identificada") {
          resultadoDiv.classList.add('invalid');
      } else {
          resultadoDiv.classList.add('valid');
      }
  }

  if (luhnStatusDiv) {
      if (bandeira !== "Bandeira não identificada" && numero.length >= minLengthForFullValidation) {
        luhnStatusDiv.textContent = `Validade Luhn: ${isLuhnValid ? 'Válido' : 'Inválido'}`;
        luhnStatusDiv.classList.remove('valid', 'invalid');
        luhnStatusDiv.classList.add(isLuhnValid ? 'valid' : 'invalid');
      } else {
        luhnStatusDiv.textContent = '';
      }
  }

  if (overallStatusDiv) {
      if (bandeira !== "Bandeira não identificada" && numero.length >= minLengthForFullValidation) {
        overallStatusDiv.textContent = `Cartão Válido (Completo): ${isCardValid ? 'Sim' : 'Não'}`;
        overallStatusDiv.classList.remove('valid', 'invalid');
        overallStatusDiv.classList.add(isCardValid ? 'valid' : 'invalid');
      } else {
        overallStatusDiv.textContent = '';
      }
  }
} // Fim da função validar()

const inputCartao = document.getElementById('numeroCartao');

if (inputCartao) {
    // Event listener para a tecla "Enter"
    inputCartao.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault(); // Impede o comportamento padrão do Enter
            validar(); // Chama sua função de validação
        }
    });

    // NOVO: Event listener para o evento 'keyup' que chamará a função de limpeza
    // 'keyup' é disparado quando a tecla é solta.
    inputCartao.addEventListener('keyup', () => {
        // Se o campo estiver vazio, limpa os resultados
        if (inputCartao.value.length === 0) {
            clearResults();
        }
    });

    // Removido: O event listener 'input' que fazia a validação em tempo real.
    // inputCartao.addEventListener('input', () => { validar(); });
}