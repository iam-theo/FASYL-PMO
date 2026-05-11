import React, { createContext, useContext, useState } from "react";

const StageContext = createContext();

export const useStage = () => useContext(StageContext);

export function StageProvider({ children }) {
  const [activeStage, setActiveStage] = useState(null);
  const [stageData, setStageData] = useState({});
  const [preview, setPreview] = useState(null);

  /**
   * Update checklist item
   */
  const toggleChecklist = (stageKey, itemKey) => {
    setStageData((prev) => {
      const stage = prev[stageKey] || { checklist: [], documents: [] };

      const updatedChecklist = stage.checklist.map((item) =>
        item.key === itemKey
          ? { ...item, checked: !item.checked }
          : item
      );

      return {
        ...prev,
        [stageKey]: {
          ...stage,
          checklist: updatedChecklist,
        },
      };
    });
  };

  /**
   * Update uploaded document
   */
  const updateDocument = (stageKey, docKey, file) => {
    setStageData((prev) => {
      const stage = prev[stageKey] || { checklist: [], documents: [] };

      const updatedDocs = [
        ...stage.documents.filter((d) => d.key !== docKey),
        {
          key: docKey,
          fileUrl: URL.createObjectURL(file),
        },
      ];

      return {
        ...prev,
        [stageKey]: {
          ...stage,
          documents: updatedDocs,
        },
      };
    });
  };

  return (
    <StageContext.Provider
      value={{
        activeStage,
        setActiveStage,
        stageData,
        setStageData,
        toggleChecklist,
        updateDocument,
        preview,
        setPreview,
      }}
    >
      {children}
    </StageContext.Provider>
  );
}