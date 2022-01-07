import React from "react";
import {useState} from "react";

export default function FormWithName() {
    const [name, setName] = useState('');

    return (
        <div>
            <form>
                <label>Name:</label>
                <input type="text" onChange={(e) => setName(e.target.value)} />
            </form>
            <br />
            Name is: {name}
        </div>
    );
}