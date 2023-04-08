import React, { useState, useRef } from "react";
import axios from "axios";
import playIcon from "./images/icon-play.svg";
import searchIcon from "./images/icon-search.svg";
import logo from "./images/logo.svg";
import arrow from "./images/icon-arrow-down.svg";
import moon from "./images/icon-moon.svg";
import "./App.css";
import Error from "./Error";

const App = () => {
  const [word, setWord] = useState("");
  const [foundWord, setFoundWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [definition, setDefinition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [showError, setShowError] = useState(false);
  const [content, setContent] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // add this state variable

  const audioRef = useRef(null);

  const handleSearch = () => {
    setRefreshCounter((prevCounter) => prevCounter + 1); // update the counter on each search
    setFoundWord("");
    setPhonetic("");
    setAudioUrl("");
    setDefinition("");
    setErrorMessage("");
    setMeanings([]);
    setDuplicates([]);
    setContent(false);
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => {
        const data = response.data?.[0];
        if (!data) {
          setShowError(true);
          setContent(false);
        } else {
          setShowError(false);
          setContent(true);
          setFoundWord(data.word ?? "");
          setPhonetic(data.phonetics?.[0]?.text ?? "");
          setAudioUrl(data.phonetics?.[0]?.audio ?? "");

          const meaningsArr =
            data.meanings?.map((meaning) => {
              const synonymsArr = meaning.synonyms
                ?.map((synonym) => synonym)
                .join(", ");
              const antonymsArr = meaning.antonyms
                ?.map((antonym) => antonym)
                .join(", ");
              const definitionsArr = meaning.definitions?.map(
                (definition) => definition.definition
              );
              return {
                partOfSpeech: meaning.partOfSpeech,
                definitions: definitionsArr,
                synonyms: synonymsArr,
                antonyms: antonymsArr,
              };
            }) ?? [];

          setMeanings(meaningsArr);
          console.log(content);

          // Check for duplicate definitions
          const defWordsArr = meaningsArr
            .map((meaning) => meaning.definitions)
            .flat()
            .map((definition) => definition?.split(" ")[0] || "");
          const uniqueDefWords = new Set(defWordsArr);

          if (uniqueDefWords.size !== defWordsArr.length) {
            const duplicatesArr = [
              ...defWordsArr.filter(
                (word, index, arr) => arr.indexOf(word) !== index
              ),
            ];
            setDuplicates(duplicatesArr);
          }

          setErrorMessage("");
        }
      })
      .catch((error) => {
        console.error(error);
        setShowError(true);
        setErrorMessage("Failed to fetch definition");
      });
  };

  const handlePlay = () => {
    audioRef.current.play();
  };
  const inputHandle = (e) => {
    if (!e.target.value) {
      setSearchError("Whoops, can’t be empty…");
    } else {
      setWord(e.target.value);
      setSearchError("");
    }
  };

  const handleBackspace = (e) => {
    if (e.keyCode === 8) {
      setWord(word.slice(0, -1));
    }
  };

  const ErrorComponent = () => {
    return (
      <div>
        <Error message={errorMessage} />
      </div>
    );
  };
  const handleMenu = () => {
    document.getElementById("fonts").classList.toggle("pass");
  };
  const sansSerif = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      el.style.fontFamily = "sans-serif";
    });
  };
  const sans = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      el.style.fontFamily = "sans";
    });
  };
  const mono = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      el.style.fontFamily = "Inconsolata";
    });
  };
  function themeChange() {
    const h1 = document.getElementsByTagName("h1");
    const h4 = document.getElementsByTagName("h4");
    const li = document.getElementsByTagName("li");
    const body = document.getElementsByTagName("body")[0];
    const menuP = document.getElementsByClassName("m");

    for (let i = 0; i < h1.length; i++) {
      h1[i].style.color = "white";
    }

    for (let i = 0; i < h4.length; i++) {
      h4[i].style.color = "white";
    }

    for (let i = 0; i < li.length; i++) {
      li[i].style.color = "white";
    }

    for (let i = 0; i < menuP.length; i++) {
      menuP[i].style.color = "white";
    }

    body.style.background = "#050505";

    const input = document.getElementById("input");
    input.style.background = "#1F1F1F";
    input.style.color = "white";

    const fonts1 = document.getElementById("fonts");

    fonts1.style.background = "#1f1f1f";
    fonts1.style.boxShadow = "0px 5px 30px #A445ED";
    const anim = document.getElementById("anim");
    anim.style.background = "#a445ed";
    const boll = document.getElementById("boll");
    boll.style.transform = "translateX(20px)";
    boll.style.transition = "all 0.3s";
    const moon = document.getElementById("moon");
    moon.style.color = "#a445ed";
  }
  return (
    <div className="App" key={refreshCounter}>
      <nav>
        <div className="font-family pass" id="fonts">
          <p className="sansSerif m" onClick={sansSerif}>
            sans serif
          </p>
          <p className="sans m" onClick={sans}>
            sans
          </p>
          <p className="memo m" onClick={mono}>
            memo
          </p>
        </div>
        <img src={logo} alt="" />
        <p onClick={handleMenu} className="m">
          Sans Serif
        </p>
        <img src={arrow} className="arrow" alt="" />
        <hr />
        <div className="anim" id="anim" onClick={themeChange}>
          <div id="boll"></div>
        </div>
        <img src={moon} id="moon" className="moon" alt="" />
      </nav>
      <input
        type="text"
        id="input"
        value={word}
        onChange={inputHandle}
        onKeyDown={handleBackspace}
        placeholder="Search for any word…"
      />
      <p className="perr">{searchError}</p>
      <img onClick={handleSearch} src={searchIcon} className="search" alt="" />
      {content && (
        <div id="content">
          <h1 className="word">{foundWord}</h1>
          {phonetic && <p className="phonetic">/{phonetic}/</p>}
          {audioUrl && (
            <img className="audio" src={playIcon} onClick={handlePlay} alt="" />
          )}
          <audio ref={audioRef} src={audioUrl} type="audio/mpeg" hidden />
          {meanings?.map((meaning, index) => (
            <div key={index}>
              <h4 className="speech">{meaning.partOfSpeech}</h4>
              <div>
                <p className="def">Meaning</p>
                <div className="items">
                  <ul>
                    {meaning.definitions?.map((definition, index) => (
                      <li className="def-item" key={index}>
                        {definition}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div className="Syn">
                  <p className="pS">Synonyms</p>
                  <ul>
                    {meaning.synonyms.split(", ").map((synonym, index) => (
                      <li className="li" key={index}>
                        {synonym}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {meaning.antonyms && meaning.antonyms.length > 0 && (
                <div className="diva">
                  <p className="pA">Antonyms:</p>
                  <ul>
                    {meaning.antonyms.split(", ").map((antonym, index) => (
                      <li className="ali" key={index}>
                        {antonym}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div>{showError && <ErrorComponent />}</div>
    </div>
  );
};

export default App;
