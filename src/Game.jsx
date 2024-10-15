// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import './Game.css';

const wordList = [
    "bahçe", "bensu", "hakan", "barış", "savaş", 
    "ceviz", "gölge", "halat", "havuç", "kıyma", 
    "radyo", "salon", "tarla", "uçmak", "zebra", 
    "araba", "biber", "çizgi", "dalga", "duman", 
    "fidan", "izmir", "kanat", "tuzlu", "kadın", 
    "sofra", "dünya", "koyun", "bursa", "çadır", 
    "madde", "neden", "yağmur", "sesli", "katlı", 
    "elden", "çörek", "kürek", "kaşık", "göbek", 
    "kitap", "balon", "arazi", "boğaz", "kemer", 
    "bahar", "kaşık", "kitap", "balon", "arazi", 
    "boğaz", "kemer", "halka", "diken", "kanca", 
    "kanun", "eller", "çöpçü", "uzman", "piyaz", 
    "turşu", "kavuk", "kule", "gezme", "bölge", 
    "parka", "bıçak", "düşün", "taşın", "giyin", 
    "kayık", "buzlu", "adana", "klima", "sözlü", 
    "şehir", "tatlı", "yıldız"
  ];
  

function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function checkGuess(guess, word) {
    let result = [];
    let greenIndexes = [];
  
    // İlk aşamada yeşil harfleri bulalım ve yeşil harflerin pozisyonlarını saklayalım
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === word[i]) {
        result.push("correct");  // Doğru harf, doğru yer (yeşil)
        greenIndexes.push(i);  // Yeşil olan indeksleri sakla
      } else {
        result.push(null);  // Şimdilik sarı veya gri değil
      }
    }
  
    // İkinci aşamada sarı harfleri kontrol edelim
    for (let i = 0; i < guess.length; i++) {
      if (result[i] !== "correct") {  // Eğer zaten yeşil değilse
        if (word.includes(guess[i])) {
          let isYellow = false;
          // Aynı harf kelimenin içinde varsa ama yeşil olanlardan biriyle eşleşmiyorsa sarı yap
          for (let j = 0; j < word.length; j++) {
            if (guess[i] === word[j] && !greenIndexes.includes(j)) {
              result[i] = "present";  // Doğru harf, yanlış yer (sarı)
              isYellow = true;
              break;
            }
          }
          if (!isYellow) {
            result[i] = "absent";  // Eğer sarı olamıyorsa gri yap
          }
        } else {
          result[i] = "absent";  // Harf yok (gri)
        }
      }
    }
  
    return result;
  }

function Game() {
  const [currentWord, setCurrentWord] = useState("");  // Bulunacak kelime
  const [guess, setGuess] = useState("");  // Kullanıcının tahmini
  const [allGuesses, setAllGuesses] = useState([]);  // Tüm tahminler ve sonuçlar
  const [message, setMessage] = useState("");  // Sonuç mesajı

  const maxGuesses = 6; // Toplam tahmin hakkı

  const handleRandomWord = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setAllGuesses([]);
    setGuess("");
    setMessage("Rastgele kelime seçildi!");
  };

  const handleEnterWord = () => {
    const userWord = prompt("Bir kelime girin:").toLowerCase();
    if (userWord.length !== 5) {
      alert("Kelime 5 harfli olmalı!");
    } else {
      setCurrentWord(userWord);
      setAllGuesses([]);
      setGuess("");
      setMessage(`Kendi kelimenizi girdiniz: ${userWord}`);
    }
  };

  const handleGuessChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  };

  // eslint-disable-next-line no-unused-vars
  const [isGameOver, setIsGameOver] = useState(false);
  const handleSubmitGuess = () => {
    if (guess.length !== 5) {
      alert("Tahmin 5 harfli olmalıdır!");
      return;
    }

    if (allGuesses.length >= maxGuesses) {
      alert("Artık daha fazla tahmin yapamazsınız!");
      return;
    }

    const result = checkGuess(guess, currentWord);
    
    // Yeni tahmini ve sonucunu diziye ekleyin
    setAllGuesses(prevGuesses => [...prevGuesses, { guess, result }]);
    
    if (guess === currentWord) {
      setMessage("Tebrikler! Doğru kelimeyi buldunuz!");
      setIsGameOver(true);
    } else if (allGuesses.length === maxGuesses - 1) {
      setMessage(`Üzgünüm! Kelimeyi bulamadınız! Kelime: ${currentWord}`);
      setIsGameOver(true);
    } else {
      setMessage("Yanlış tahmin! Tekrar deneyin.");
    }

    setGuess("");
  };

  const handleAutoPlay = () => {
    if (allGuesses.length >= maxGuesses) {
      setMessage("Artık daha fazla tahmin yapamazsınız!");
      return;
    }

    const lastGuess = allGuesses[allGuesses.length - 1]; // Son tahmin
    if (!lastGuess) {
      return; // Eğer daha önce tahmin yapılmadıysa çık
    }

    const { guess: lastWord, result } = lastGuess;

    // İlk adım: Yeşil harflere göre kelimeleri filtrele (Green Array)
    const greenArr = wordList.map(word => {
      const feedback = checkGuess(lastWord, word);
      return feedback.every((status, index) => {
        return (status === "correct" && result[index] === "correct") || result[index] !== "correct";
      })
      ? word
      : 'aaaaa';  // Uygun olmayan kelimeleri 'aaaaa' ile değiştir
    });

    // 'aaaaa' olmayan bir kelime tahmin etmeye çalış
    const validGreenWords = greenArr.filter(word => word !== 'aaaaa');

    // Eğer hiç geçerli kelime kalmazsa, çık
    if (validGreenWords.length === 0) {
      setMessage("Geçerli kelime kalmadı.");
      return;
    }

    // İkinci adım: Sarı harflere göre kelimeleri filtrele (Yellow Array)
    const yellowArr = validGreenWords.filter(word => {
      const feedback = checkGuess(lastWord, word);
      return feedback.every((status, index) => {
        return (status === "present" && result[index] === "present") || result[index] !== "present";
      });
    });

    // Eğer yellowArr boş ise, yeşil kelimelerden tahmin yap
    const finalArr = yellowArr.length > 0 ? yellowArr : validGreenWords;

    // Rastgele bir kelime seç
    let autoGuess = finalArr[Math.floor(Math.random() * finalArr.length)];

    // Eğer 'aaaaa' tahmini yapmaya çalışıyorsa tekrar seç
    while (autoGuess === 'aaaaa') {
      autoGuess = finalArr[Math.floor(Math.random() * finalArr.length)];
    }

    const newResult = checkGuess(autoGuess, currentWord);

    // Yeni tahmini ve sonucunu diziye ekleyin
    setAllGuesses(prevGuesses => [...prevGuesses, { guess: autoGuess, result: newResult }]);

    if (autoGuess === currentWord) {
      setMessage("Tebrikler! Doğru kelimeyi buldunuz!");
    } else if (allGuesses.length === maxGuesses - 1) {
      setMessage(`Üzgünüm! Kelimeyi bulamadınız! Kelime: ${currentWord}`);
    } else {
      setMessage("Bilgisayar bir tahminde bulundu.");
    }
  };

  return (
    <div className="game-container">
      <h1>Wordle Solver</h1>
      <div className="button-container">
        <button className="button" onClick={handleRandomWord}>Rastgele Kelime Seç</button>
        <button className="button secondary" onClick={handleEnterWord}>Kendi Kelimenizi Girin</button>
      </div>
      <div className="guess-input">
        <input
          type="text"
          maxLength="5"
          value={guess}
          onChange={handleGuessChange}
          placeholder="5 harfli tahmin"
        />
        <button onClick={handleSubmitGuess}>Tahmin Et</button>
        {currentWord && <button className="button secondary" onClick={handleAutoPlay}>Yardım Et!</button>} {/* Yardım Et butonu */}
      </div>
      {/* Tüm tahminleri sırayla göster */}
      <div className="grid">
        {allGuesses.map((guessData, index) => (
          <div key={index} className="grid-row">
            {guessData.result.map((status, i) => (
              <div key={i} className={`grid-cell ${status}`}>{guessData.guess[i]}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="message">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Game;
