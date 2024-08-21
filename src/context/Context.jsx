import { createContext, useState } from "react";
import run from "../config/vector";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt = input) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      let response = await run(prompt);
      setRecentPrompt(prompt);

      // Check if the prompt already exists in prevPrompts
      setPrevPrompts((prev) => {
        if (!prev.includes(prompt)) {
          return [...prev, prompt];
        }
        return prev;
      });

      let responseArray = response.split("**");

      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        let cleanLine = responseArray[i].trim().replace(/^\*|\*$/g, "");
        let parts = cleanLine.split(":");

        if (parts.length === 2) {
          newResponse += "<b>" + parts[0] + ":</b>" + parts[1] + "<br/>";
        } else {
          newResponse += cleanLine + "<br/>";
        }
      }

      let newResponseArray = newResponse.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error in onSent function:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
