import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getComponent } from "./FunctionComponents";

function HistoryArea({ history }) {
  const eventFire = (el, etype) => {
    if (el && el.fireEvent) {
      el.fireEvent("on" + etype);
    } else if (el) {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  };

  // Handle Replaying the history
  const handleReplay = (arr, id) => {
    if (arr.length === 0) return;
    let i = 0;
    let repeat = 1;

    let str1 = `comp${arr[i]}-${id}-${i}`;

    // Handle Wait at first index
    if (arr[i] === "WAIT") {
      let str2 = `comp${arr[i]}-${id}-${i}`;
      let last_time = new Date().getTime();
      let curr_time = new Date().getTime();

      while ((curr_time - last_time) / 1000 < history.wait[str2] - 2) {
        curr_time = new Date().getTime();
      }
    }

    // Handle Repeat at first index
    else if (arr[i] !== "REPEAT") {
      eventFire(document.getElementById(str1), "click");
    } else {
      repeat = history.repeat[str1] + 1;
    }
    i++;

    // Each function execution takes 2 seconds
    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      // Handle Wait
      if (arr[i] === "WAIT") {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        let last_time = new Date().getTime();
        let curr_time = new Date().getTime();

        while ((curr_time - last_time) / 1000 < history.wait[str2] - 2) {
          curr_time = new Date().getTime();
        }
        i++;
      }
      // Handle Repeat Component at current index
      else if (arr[i] === "REPEAT") {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        repeat = repeat * (history.repeat[str2] + 1);
        i++;
      }
      // If Repeat component is at previous index
      else if (arr[i - 1] === "REPEAT" && repeat > 2) {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        repeat--;
      } else {
        let str2 = `comp${arr[i]}-${id}-${i}`;
        eventFire(document.getElementById(str2), "click");
        i++;
      }
    }, 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-3">
      <div className="font-bold mb-5 text-center border border-2 rounded text-white bg-green-400 p-2 w-auto">
        History Area
      </div>
      <div className="grid grid-flow-row">
        {history.map((h, index) => {
          return (
            <div className="w-60" key={index}>
              <div className="p-4 bg-gray-200 rounded-lg">
                <div className="w-52 p-2">
                  <div className="text-center mx-auto my-2 mb-4">
                    <button
                      className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700"
                      onClick={() => handleReplay(h.comps, h.id)}
                    >
                      Replay
                    </button>
                  </div>

                  <ul className="w-48 h-full">
                    {h.comps.map((x, i) => {
                      let component_id = `comp${x}-${h.id}-${i}`;
                      return (
                        <li key={`${x}-${h.id}-${i}`}>
                          {getComponent(x, component_id)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryArea;
