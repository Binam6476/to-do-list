import { useState } from "react";
import { TodoFormSchema } from "../schema/schema";
import type { z } from "zod";
import { useTodos } from "../context/TodoContext";
// import { STATUS_META, STATUS_ORDER } from "../types";
import { useParams } from "react-router-dom";
import { Calendar } from "../components/ui/calendar";
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function CreateTodo() {
const [editId, setEditId]=useState<string | null>()
  const {
    todos,
    addTodo,
    // deleteTodo,
    updateTodo,
    // setStatus,
    // clearTodos,
  } = useTodos();

const {id}=useParams();
console.log("hgjhg id is:",id);
const edit=id?todos.find((t)=>t.id==id):undefined;

  const [formValues, setFormValues] = useState<z.infer<typeof TodoFormSchema>>({
    title: edit?.title||"",
    description: edit?.description||"",
  });

const [date, setDate]=useState<Date | undefined>();

  const handleClear = () => {
    setEditId(null);
    setFormValues({ title: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = TodoFormSchema.safeParse(formValues);
    if (!result.success) {
      console.error("Invalid form values:", result.error);
      return;
    }

    if(edit){
      updateTodo(edit.id, result.data);
    }
    else{
      addTodo({...result.data, status: "pending"});
    }
    handleClear();
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center py-8">
      <form
        onSubmit={handleSubmit}
        className="flex w-96 max-w-full flex-col gap-2 rounded-3xl border-2 border-slate-300 bg-gray-300 p-4 "
      >
        <h1 className="w-full text-center text-lg font-bold text-slate-900">
          Add Todo
        </h1>

        <input
          value={formValues.title}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          placeholder="Enter todo..."
          className="rounded-2xl border-2 border-slate-300 bg-white p-2 text-slate-900 outline-none"
        />

        <textarea
          value={formValues.description}
          onChange={(e) =>
            setFormValues({ ...formValues, description: e.target.value })
          }
          placeholder="Enter todo description..."
          rows={3}
          className="resize-none rounded-2xl border-2 border-slate-300 bg-white p-2 text-slate-900 outline-none"
        />

    

           <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClear}
            type="button"
            className="bg-pink-600 text-white py-2 px-4 rounded-2xl hover:bg-red-600 cursor-pointer"
          >
            Cancel
          </button>
          <button

            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-2xl hover:bg-blue-600 cursor-pointer"
          >
            {edit? "update":"Submit"}
          </button>
        </div>
      </form>
     
    </div>
  );
}

export default CreateTodo;