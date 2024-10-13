// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import './Game.css';

const wordList = [
  "bahçe", "bensu", "hakan", "barış", "savaş", 
  "ceviz", "gölge", "halat", "havuç", "kıyma", 
  "radyo", "salon", "tarla", "uçmak", "zebra", 
  "araba", "biber", "çizgi", "dalga", "duman", 
  "fidan", "izmir", "kanat", "tuzlu"
];

function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function checkGuess(guess, word) {
  let result = [];
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === word[i]) {
      result.push("correct");  // Doğru harf, doğru yer
    } else if (word.includes(guess[i])) {
      result.push("present");  // Doğru harf, yanlış yer
    } else {
      result.push("absent");  // Harf yok
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
    } else if (allGuesses.length === maxGuesses - 1) {
      setMessage(`Üzgünüm! Kelimeyi bulamadınız! Kelime: ${currentWord}`);
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
    
    // Geçmiş tahmine göre yeni kelimeler belirle
    const possibleWords = wordList.filter(word => 
      word !== currentWord && // Geçerli kelimeyi hariç tut
      !allGuesses.some(g => g.guess === word) // Daha önce tahmin edilmedi
    );

    // Geçmiş sonuca göre kelimeleri daralt
    const filteredWords = possibleWords.filter(word => {
      const feedback = checkGuess(lastWord, word);
      return feedback.every((status, index) => {
        return (
          (status === "correct" && result[index] === "correct") ||
          (status === "present" && result[index] === "present") ||
          (status === "absent" && result[index] === "absent")
        );
      });
    });

    // Rastgele kelime tahmini yap
    if (filteredWords.length > 0) {
      const autoGuess = filteredWords[Math.floor(Math.random() * filteredWords.length)];
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
    } else {
      setMessage("Daha fazla tahmin yapılamıyor.");
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
