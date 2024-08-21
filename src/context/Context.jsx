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

  const delayPara = (index, nextWord) => {};

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);

    const response = await run(input);

    let responseArray = response.split("**");

    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      // Trim any leading or trailing whitespace and stars from each line
      let cleanLine = responseArray[i].trim().replace(/^\*|\*$/g, "");

      // Split each line into two parts: before and after the colon
      let parts = cleanLine.split(":");

      if (parts.length === 2) {
        // Wrap the part before the colon in <b> tags
        newResponse += "<b>" + parts[0] + ":</b>" + parts[1] + "<br/>";
      } else {
        // If there's no colon, just add the line as is
        newResponse += cleanLine + "<br/>";
      }
    }

    // Set the formatted response as result data
    setResultData(newResponse);
    setLoading(false);
    setInput("");
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
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
