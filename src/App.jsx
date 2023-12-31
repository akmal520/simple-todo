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
import { motion } from 'framer-motion';

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

    const variantContainer = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.5,
            },
        },
    };

    const variantItem = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <section className="h-full w-full bg-bgColor">
            <div className="container mx-auto py-10 w-full flex flex-col items-center lg:px-72">
                <motion.h1
                    className="text-5xl font-bold text-headline tracking-widest uppercase mb-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.25,
                        ease: [0, 0.71, 0.2, 1.01],
                    }}
                >
                    Ben Todo
                </motion.h1>

                <motion.div
                    className="w-full h-full"
                    variants={variantContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="flex items-center gap-4 relative"
                        variants={variantItem}
                    >
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
                            aria-label="Add"
                        >
                            <FaPlus />
                        </button>
                    </motion.div>

                    <motion.div
                        className="mt-4 flex flex-col gap-3 border-2 border-cardBg rounded-md p-4 scrollbar overflow-x-auto h-[70vh]"
                        variants={variantItem}
                    >
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
                                        aria-label="Delete"
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
                    </motion.div>
                </motion.div>
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
