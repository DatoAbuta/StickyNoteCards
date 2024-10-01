"use client";

import Image from "next/image";
import DownloadBtn from "../app/imgs/download.svg";
import DeleteBtn from "../app/imgs/delete.svg";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormComponent from "./components/FormComponent/FormComponent";
import CheckBoxComponent from "./components/CheckBoxComponent/CheckBoxComponent";
import Footer from "./components/FooterComponent/FooterComponent";

interface ColorCard {
  color: string;
  texts: { text: string; completed: boolean }[];
}

export default function Home() {
  const [spin, setSpin] = useState(false);
  const [opened, setOpened] = useState(false);
  const [cards, setCards] = useState<ColorCard[]>([]);
  const [inputText, setInputText] = useState<Record<number, string>>({});
  const notify = () => toast.success("Text Added Successfully");

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("notes") || "[]");
    setCards(
      storedCards.map((card: any) => ({
        color: card.color,
        texts: Array.isArray(card.texts)
          ? card.texts.map((t: any) => ({ text: t.text, completed: t.completed }))
          : [],
      }))
    );
  }, []);

  const handleClick = () => {
    setSpin(!spin);
    setOpened(!opened);
    setTimeout(() => {
      setSpin(!spin);
    }, 1000);
  };

  const handleColorSelect = (color: string) => {
    const newCards = [...cards, { color, texts: [] }];
    setCards(newCards);
    localStorage.setItem("notes", JSON.stringify(newCards));
  };

  // New function to download specific card data
  const handleDownloadCard = (cardIndex: number) => {
    const card = cards[cardIndex];

    if (!card) {
      toast.error("Card not found!");
      return;
    }

    const cardContent = `Card ${cardIndex + 1}:\n` +
      (card.texts.length === 0 
        ? "  Empty\n" 
        : card.texts.map((t, i) => `  Text ${i + 1}: ${t.text.trim() === "" ? 'Empty' : t.text} (Completed: ${t.completed})\n`).join("")
      );

    const blob = new Blob([cardContent], { type: "text/plain" });
    saveAs(blob, `card-${cardIndex + 1}.txt`);
  };

  const handleDownloadAll = () => {
    if (cards.length === 0) {
      toast.error("No cards to download!");
      return;
    }

    const allCardsContent = cards.map((card, index) => {
      if (card.texts.length === 0) {
        return `Card ${index + 1}: \n  Empty\n`;
      }

      return `Card ${index + 1}: \n` +
        card.texts.map((t, i) => `  Text ${i + 1}: ${t.text.trim() === "" ? 'Empty' : t.text} (Completed: ${t.completed})\n`).join("");
    }).join("\n");

    const blob = new Blob([allCardsContent], { type: "text/plain" });
    saveAs(blob, `cards.txt`);
  };

  const handleDelete = (cardIndex: number, textIndex?: number) => {
    if (textIndex === undefined) {
      const updatedCards = cards.filter((_, i) => i !== cardIndex);
      setCards(updatedCards);
      localStorage.setItem("notes", JSON.stringify(updatedCards));
    } else {
      const updatedCards = cards.map((card, i) => {
        if (i === cardIndex) {
          return {
            ...card,
            texts: card.texts.filter((_, j) => j !== textIndex),
          };
        }
        return card;
      });
      setCards(updatedCards);
      localStorage.setItem("notes", JSON.stringify(updatedCards));
    }
  };

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setInputText((prev) => ({
      ...prev,
      [index]: event.target.value,
    }));
  };

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>, index: number) => {
    e.preventDefault();

    const text = inputText[index]?.trim();
    if (!text) {
      toast.error("You Should Enter Text");
      return;
    }

    if (text !== "") {
      notify();
    }

    const updatedCards = cards.map((item, i) =>
      i === index
        ? { ...item, texts: [...item.texts, { text, completed: false }] }
        : item
    );
    setCards(updatedCards);
    localStorage.setItem("notes", JSON.stringify(updatedCards));
    setInputText((prev) => ({ ...prev, [index]: "" }));
  };

  const handleTextComplete = (cardIndex: number, textIndex: number) => {
    const updatedCards = cards.map((card, i) => {
      if (i === cardIndex) {
        const updatedTexts = card.texts.map((text, j) =>
          j === textIndex ? { ...text, completed: !text.completed } : text
        );
        return { ...card, texts: updatedTexts };
      }
      return card;
    });
    setCards(updatedCards);
    localStorage.setItem("notes", JSON.stringify(updatedCards));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedCards = Array.from(cards);
    const [movedCard] = reorderedCards.splice(source.index, 1);
    reorderedCards.splice(destination.index, 0, movedCard);

    setCards(reorderedCards);
    localStorage.setItem("notes", JSON.stringify(reorderedCards));
  };

  return (
    <div className="min-h-screen flex flex-col pt-10">
      <div className="flex-grow overflow-y-auto pb-20">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppableNotes" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col items-center gap-4 w-full"
              >
                {cards.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3 rounded-lg shadow-lg text-center z-5"
                        style={{
                          backgroundColor: item.color,
                          width: "250px",
                          height: "auto",
                          position: "relative",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="flex justify-end gap-3 justify-evenly">
                          <h5>Note</h5>
                          <Image
                            src={DeleteBtn}
                            alt="Delete Button"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleDelete(index)}
                          />
                          <Image
                            src={DownloadBtn}
                            alt="Download Button"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleDownloadCard(index)} // Download specific card
                          />
                        </div>
                        <FormComponent
                          HandleTextSubmit={(e: FormEvent<HTMLFormElement>) =>
                            handleTextSubmit(e, index)
                          }
                          value={inputText[index] || ""}
                          onchange={(e) => handleTextChange(e, index)}
                        />
                        <div className="mt-2 flex flex-col justify-center items-center">
                          {item.texts.map((textItem, textIndex) => (
                            <div
                              key={textIndex}
                              className="flex items-center mb- w-full justify-evenly"
                            >
                              <CheckBoxComponent
                                checked={textItem.completed}
                                onchange={() =>
                                  handleTextComplete(index, textIndex)
                                }
                              />
                              <span
                                className={textItem.completed ? "line-through" : ""}
                                style={{ width: "100px" }}
                              >
                                {textItem.text}
                              </span>
                              <Image
                                src={DeleteBtn}
                                alt="Delete Text Button"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleDelete(index, textIndex)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Footer
        onColorSelect={handleColorSelect}
        opened={opened}
        onClick={handleClick}
        spin={spin}
        onDownloadAll={handleDownloadAll} // Pass the download all function
      />
    </div>
  );
}
