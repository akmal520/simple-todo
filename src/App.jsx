import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { ImSpinner9 } from 'react-icons/im';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    doc,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from './services/firebase';
import { addData } from './services/all.services';

function App() {
    const [todo, setTodo] = useState([]);
    const [addTodo, setAddTodo] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'todo'), orderBy('isComplete', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const datas = [];
            snapshot.forEach((doc) => {
                datas.push({ ...doc.data(), id: doc.id });
            });
            setTodo(datas);
        });
        return () => unsubscribe();
    }, []);

    // console.log(todo);

    const handelAddTodo = () => {
        addData(addTodo);
        setInput('');
    };

    const handleInput = (e) => {
        setAddTodo({
            text: e.target.value,
            isComplete: false,
            date: Date.now(),
        });
        setInput(e.target.value);
    };

    const handleComplete = (check, id) => {
        updateDoc(doc(db, 'todo', id), {
            isComplete: !check,
        });
    };

    return (
        <section className="h-full w-full bg-bgColor">
            <div className="container mx-auto py-10 w-full flex flex-col items-center lg:px-72">
                <h1 className="text-5xl font-bold text-headline tracking-widest uppercase mb-4">
                    Ben Todo
                </h1>

                <div className="w-full h-full">
                    <div className="flex items-center gap-4 relative">
                        <input
                            type="text"
                            placeholder="What do you want to do?"
                            name="todo"
                            className="bg-cardBg pl-4 pr-8 py-3 w-full rounded text-headline focus:border-[#7f5af0] tracking-widest font-semibold"
                            onChange={handleInput}
                            value={input}
                        />
                        <button
                            type="button"
                            className="p-2 absolute right-2 text-headline bg-green-600 rounded-full"
                            onClick={handelAddTodo}
                            disabled={input !== '' ? false : true}
                        >
                            <FaPlus />
                        </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-2 border-cardBg rounded-md p-4 scrollbar overflow-x-auto h-[70vh]">
                        {todo.length > 0 ? (
                            todo.map((item) => (
                                <div
                                    className="flex items-center bg-cardBg p-3 rounded-lg w-full relative border border-bgColor hover:border-[#7f5af0] transition"
                                    key={item.id}
                                >
                                    <input
                                        type="checkbox"
                                        name={item.id}
                                        id={item.id}
                                        className="w-4 h-4 cursor-pointer rounded bg-bgColor text-green-600 focus:ring-transparent focus:outline-none focus:border-none"
                                        defaultChecked={item.isComplete}
                                    />
                                    <label
                                        htmlFor={item.id}
                                        className={`ml-5 cursor-pointer font-medium text-lg tracking-wider capitalize w-full ${
                                            item.isComplete
                                                ? 'line-through text-subHeadline'
                                                : 'text-headline'
                                        }`}
                                        onClick={() =>
                                            handleComplete(
                                                item.isComplete,
                                                item.id
                                            )
                                        }
                                    >
                                        {item.text}
                                    </label>
                                    <button
                                        type="button"
                                        className="p-3 right-2 text-headline hover:text-red-600 transition absolute bg-bgColor rounded-full"
                                        onClick={async () =>
                                            await deleteDoc(
                                                doc(db, 'todo', item.id)
                                            )
                                        }
                                    >
                                        <RiDeleteBin6Fill />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex justify-center items-center">
                                <ImSpinner9 className="w-10 h-10 animate-spin text-headline" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 bg-cardBg/60 rounded-t-3xl">
                <span className="text-subHeadline text-lg font-semibold cursor-default">
                    Created by{' '}
                    <a
                        href="http://github.com/akmal520"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @Akmal
                    </a>
                </span>
            </footer>
        </section>
    );
}

export default App;
