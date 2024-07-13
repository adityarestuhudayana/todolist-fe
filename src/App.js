import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [isModalClicked, setIsModalClicked] = useState(false);
  const [todosData, setTodosData] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);

  const getAllTodos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/notes");
      setTodosData(response.data.data);
      setFilteredTodos(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    const searchData = todosData.filter((item) =>
      item.note.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTodos(searchData);
  }, [searchValue, todosData]);

  const deleteTodo = async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/notes/${id}`
      );
      if (response.status === 204) getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/notes", {
        note: newNote,
      });
      if (response.status === 201) {
        setNewNote("");
        setIsModalClicked(false);
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckbox = async (e) => {
    const id = e.target.id;
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/notes/${id}`
      );
      if (response.status === 200) getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const filterTodos = (e) => {
    const value = e.target.value;
    let filteredData;

    if (value === "Completed") {
      filteredData = todosData.filter((item) => item.is_complete);
    } else if (value === "Incomplete") {
      filteredData = todosData.filter((item) => !item.is_complete);
    } else {
      filteredData = todosData;
    }

    setFilteredTodos(filteredData);
  };

  return (
    <div className="p-2 container mx-auto lg:w-1/2">
      <h1 className="font-bold text-3xl text-center mb-5">TODO LIST</h1>
      <form className="">
        <div className="rounded-full border-purple-600 border-2 flex items-center py-1 px-5">
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="outline-none w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="text-2xl">
            <ion-icon name="search-outline"></ion-icon>
          </span>
        </div>
        <div className="flex items-center">
          <div className="bg-purple-600 w-[8rem] p-2 rounded-full my-2">
            <select
              id="filter"
              className="w-full h-full bg-transparent outline-none text-white cursor-pointer text-center"
              onChange={filterTodos}
            >
              <option value="All" className="text-purple-600">
                ALL
              </option>
              <option value="Completed" className="text-purple-600">
                Completed
              </option>
              <option value="Incomplete" className="text-purple-600">
                Incomplete
              </option>
            </select>
          </div>
        </div>
      </form>

      <div>
        {filteredTodos.length === 0 ? (
          <div>
            <img src="images/empty.jpg" alt="" className="w-1/2 mx-auto" />
            <h1 className="text-center font-bold text-3xl text-purple-500">List kosong</h1>
          </div>
        ) : (
          filteredTodos.map((data) => (
            <div
              key={data.id}
              className="border-2 my-2 border-purple-200 flex justify-between items-center gap-2 p-2"
            >
              <input
                id={data.id}
                type="checkbox"
                checked={data.is_complete}
                className="w-5 h-5 rounded-full"
                onChange={handleCheckbox}
              />
              <p
                className={`w-[84%] text-lg font-semibold ${
                  data.is_complete
                    ? "line-through font-normal text-slate-500"
                    : ""
                }`}
              >
                {data.note}
              </p>
              <div className="w-[12%] text-xl flex gap-2 justify-end">
                <button
                  className="flex items-center md:text-2xl"
                  onClick={deleteTodo}
                >
                  <ion-icon name="trash-outline" data-id={data.id}></ion-icon>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className="bg-purple-600 text-white w-14 h-14 flex justify-center items-center rounded-full fixed right-10 bottom-10 cursor-pointer"
        onClick={() => setIsModalClicked(!isModalClicked)}
      >
        <span className="text-3xl mt-1">
          <ion-icon name="add-outline"></ion-icon>
        </span>
      </div>

      {isModalClicked && (
        <div>
          <div
            className="bg-slate-800 fixed left-0 right-0 top-0 bottom-0 opacity-30"
            onClick={() => setIsModalClicked(false)}
          />
          <div className="bg-white w-full md:w-9/12 lg:w-1/2 h-[25rem] rounded-xl p-5 absolute top-5 left-1/2 translate-x-[-50%]">
            <h1 className="text-center font-bold text-2xl mb-7">NEW NOTE</h1>
            <form onSubmit={createTodo}>
              <input
                type="text"
                placeholder="Input your note here"
                className="w-full p-2 border-purple-600 border-2 outline-none"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex w-full justify-between absolute bottom-0 left-0 p-5">
                <a
                  className="cursor-pointer border-2 border-purple-600 text-purple-600 font-semibold py-1 px-4 rounded-lg"
                  onClick={() => setIsModalClicked(false)}
                >
                  CANCEL
                </a>
                <button className="bg-purple-600 text-white font-semibold py-1 px-4 rounded-lg">
                  APPLY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
