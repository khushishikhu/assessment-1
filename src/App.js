import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import HistoryArea from "./components/HistoryArea";


function App({ complist}) {
  const [history, setHistory] = useState([]);

  // Example function to update history after run
  const updateHistory = (newHistoryItem) => {
    setHistory(
      [...history,newHistoryItem]      
    );
  };

  // Update Lists of Mid Area
  const onDragEnd = (result) => {
    let element = result.draggableId.split("-")[0];
    console.log("khushi",result);
    const old_list = complist.midAreaLists;
    let source_index = old_list.findIndex(
      (x) => x.id === result.source.droppableId
    );
    if (source_index > -1) {
      let comp_list = old_list[source_index].comps;
      comp_list.splice(result.source.index, 1);
      old_list[source_index].comps = comp_list;
    }

    let dest_index = old_list.findIndex(
      (x) => x.id === result.destination.droppableId
    );

    if (dest_index > -1) {
      let dest_comp_list = old_list[dest_index].comps;
      dest_comp_list.splice(result.destination.index, 0, `${element}`);

      old_list[dest_index].comps = dest_comp_list;
    }
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar /> <MidArea updateHistory={updateHistory} />
          <div className=" h-screen  overflow-y-auto flex flex-row bg-white border-t border-l border-gray-200 ">
          <HistoryArea history={history} />
        </div>
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
        </div>
        </DragDropContext>
      </div>
    </div>
  );

}
// mapping state to props
const mapStateToProps = (state) => {
  return {
    complist: state.list,
  };
};

export default connect(mapStateToProps)(App);
