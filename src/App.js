import React, { useState, useRef, useEffect } from "react";
import { quotesArray, random, allowedKeys } from "./Helper";
import ItemList from "./components/ItemList";
import "./App.css";

let interval = null;

const App = () => {
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [duration, setDuration] = useState(300);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [index, setIndex] = useState(0);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState(0);
  const [quote, setQuote] = useState({});
  const [input, setInput] = useState("");
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isError, setIsError] = useState(false);
  const [lastScore, setLastScore] = useState("0");

  useEffect(() => {
    const newQuote = random(quotesArray);
    setQuote(newQuote);
    setInput(newQuote.quote);
  }, []);

  const handleEnd = () => {
    setEnded(true);
    setStarted(false);
    clearInterval(interval);
  };

  const setTimer = () => {
    const now = Date.now();
    const seconds = now + duration * 1000;
    interval = setInterval(() => {
      const secondLeft = Math.round((seconds - Date.now()) / 1000);
      setDuration(secondLeft);
      if (secondLeft === 0) {
        handleEnd();
      }
    }, 1000);
  };

  const handleStart = () => {
    setStarted(true);
    setEnded(false);
    setInput(quote.quote);
    inputRef.current.focus();
    setTimer();
  };

  const handleKeyDown = (e) => {
    e.preventDefault();
    const { key } = e;
    const quoteText = quote.quote;

    if (key === quoteText.charAt(index)) {
      setIndex(index + 1);
      const currenChar = quoteText.substring(
        index + 1,
        index + quoteText.length
      );
      setInput(currenChar);
      setCorrectIndex(correctIndex + 1);
      setIsError(false);
      outputRef.current.innerHTML += key;
    } else {
      if (allowedKeys.includes(key)) {
        setErrorIndex(errorIndex + 1);
        setIsError(true);
        outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`;
      }
    }

    const timeRemains = ((60 - duration) / 60).toFixed(2);
    const _accuracy = Math.floor(((index - errorIndex) / index) * 100);
    const _wpm = Math.round(correctIndex / 5 / timeRemains);

    if (index > 5) {
      setAccuracy(_accuracy);
      setCpm(correctIndex);
      setWpm(_wpm);
    }

    if (index + 1 === quoteText.length || errorIndex > 50) {
      handleEnd();
    }
  };

  useEffect(() => {
    if (ended) localStorage.setItem("wpm", wpm);
  }, [ended, wpm]);
  useEffect(() => {
    const stroedScore = localStorage.getItem("wpm");
    if (stroedScore) setLastScore(stroedScore);
  }, []);

  return (
    <div className="App">
      <div className="container-fluid pt-4">
        <div className="row">
          {/* Left */}
          <div className="col-sm-6 col-md-2 order-md-0 px-5">
            <ul
              className="list-unstyled text-center small login-section1"
              style={{
                alignItems: "center",
                // marginTop: 90,
                boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.6)",
                borderRadius: "20px",
              }}
            >
              {/* <ItemList
                name="WPM"
                data={wpm}
                style={
                  wpm > 0 && wpm < 20
                    ? { color: "white", backgroundColor: "#eb4841" }
                    : wpm >= 20 && wpm < 40
                    ? { color: "white", backgroundColor: "#f48847" }
                    : wpm >= 40 && wpm < 60
                    ? { color: "white", backgroundColor: "#ffc84a" }
                    : wpm >= 60 && wpm < 80
                    ? { color: "white", backgroundColor: "#a6c34c" }
                    : wpm >= 80
                    ? { color: "white", backgroundColor: "#4ec04e" }
                    : {}
                }
              /> */}
              <ItemList name="Acuracy" data={accuracy} symble="%" />
              {/* <ItemList name="CPM" data={cpm} />
              <ItemList name="Last Score" data={lastScore} /> */}
            </ul>
          </div>
          {/* Body */}
          <div
            className="col-sm-12 col-md-8 order-md-1 login-section1"
            style={{
              alignItems: "center",
              marginTop: 90,
              boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.6)",
              borderRadius: "20px",
            }}
          >
            <div className="container p-4 rounded shadow">
              <div className="text-center mt-4 header">
                <h1>Assignment</h1>

                <p className="lead">Start the five-minute Typing speed test</p>

                <div className="control my-5">
                  {ended ? (
                    <button
                      className="btn btn-outline-danger btn-circle"
                      onClick={() => window.location.reload()}
                    >
                      Reload
                    </button>
                  ) : started ? (
                    <button
                      className="btn btn-circle btn-outline-success"
                      disabled
                    
                    >
                      Fast!
                    </button>
                  ) : (
                    <button
                      className="btn btn-circle btn-outline-success"
                      onClick={handleStart}
                    >
                      Start!
                    </button>
                  )}
                  <span className="btn-circle-animation" />
                </div>
              </div>

              {ended ? (
                <div className="bg-dark text-light p-10 mt-5 lead rounded">
                  <span>"{quote.quote}"</span>
                  <span className="d-block mt- text-muted small">
                    - {quote.author}
                  </span>
                </div>
              ) : started ? (
                <div
                  className={`text-light mono quotes${
                    started ? " active" : ""
                  }${isError ? " is-error" : ""}`}
                  tabIndex="0"
                  onKeyDown={handleKeyDown}
                  placeholder="Start typing..."
                  ref={inputRef}
                >
                  {input}
                </div>
              ) : (
                <div
                  className="mono quotes text-muted"
                  tabIndex="-1"
                  ref={inputRef}
                >
                  {input}
                </div>
              )}

              <div
                className="p-4 mt-4 bg-dark text-light rounded lead"
                ref={outputRef}
              />
            </div>
          </div>

          <div className="col-sm-6 col-md-2 order-md-2 px-5">
            <ul
              className="list-unstyled text-center small login-section1"
              style={{
                alignItems: "center",
                // marginTop: 90,
                boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.6)",
                borderRadius: "20px",
              }}
            >
              <ItemList name="Timer (s)" data={duration} />
              {/* <ItemList name="Errors" data={errorIndex} /> */}
              {/* <ItemList name="Acuracy" data={accuracy} symble="%" /> */}
            </ul>
          </div>
        </div>

        <footer className="small text-muted pt-4 pb-2 footer">
          <div className="footer-info text-center">
            <ul className="list-inline m-1">
              <li className="list-inline-item">
                <a
                  href="https://github.com/Nikhil3389"
                  target="_blank"
                  title="GitHub"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  GitHub
                </a>
              </li>
            </ul>
            <div className="copyright" style={{ color: "Black" }}>
              © 2023. Designed and built with
              <span role="img" aria-label="Heart">
                {" "}
                ❤️{" "}
              </span>
              by{" "}
              <a
                href="/"
                title="Nikhil Kumar Kataria"
                style={{ color: "Black" }}
              >
                Nikhil Kumar Kataria
              </a>{" "}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
