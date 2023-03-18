import React, {useState} from 'react';
import './App.css';

const InventoryManager = () => {
    const [barcode, setBarcode] = useState('');
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');
    const [storage, setStorage] = useState({
        shelf1: Array(9).fill(null),
        shelf2: Array(9).fill(null),
        shelf3: Array(9).fill(null),
    });
    const [itemLocations, setItemLocations] = useState({});

    const getShelf = (length, width, height) => {
        if (length <= 80 && width <= 80 && height <= 80) {
            return 'shelf1';
        } else if (length <= 80 && width <= 80 && height <= 40) {
            return 'shelf3';
        } else {
            return null;
        }
    };

    const storeItem = (barcode) => {
        const length = parseInt(barcode.slice(0, 2), 10);
        const width = parseInt(barcode.slice(2, 4), 10);
        const height = parseInt(barcode.slice(4, 6), 10);

        if (barcode in itemLocations) {
            setOutput(`Error: Item with barcode ${barcode} already exists. Use a different barcode.`);
            return;
        }

        const shelf = getShelf(length, width, height);
        if (!shelf) {
            setOutput(`Error: Item with barcode ${barcode} does not fit in any shelf.`);
            return;
        }

        const updatedStorage = {...storage};
        const updatedItemLocations = {...itemLocations};

        for (let index = 0; index < updatedStorage[shelf].length; index++) {
            if (!updatedStorage[shelf][index]) {
                updatedStorage[shelf][index] = barcode;
                updatedItemLocations[barcode] = {shelf, index};
                setOutput(`Item ${barcode} stored in slot ${shelf}, row ${(index % 3) + 1}, item ${Math.floor(index / 3) + 1}`);
                break;
            }
        }

        setStorage(updatedStorage);
        setItemLocations(updatedItemLocations);
    };

    const findItem = (barcode) => {
        if (barcode in itemLocations) {
            const {shelf, index} = itemLocations[barcode];
            setOutput(`Item ${barcode} is located in slot ${shelf}, row ${(index % 3) + 1}, item ${Math.floor(index / 3) + 1}`);
        } else {
            setOutput(`Error: Item with barcode ${barcode} not found in storage.`);
        }
    };

    const removeFromStorage = (barcode, storage, itemLocations) => {
        for (const shelf in storage) {
            const slotIndex = storage[shelf].findIndex((item) => item === barcode);
            if (slotIndex !== -1) {
                const updatedStorage = {
                    ...storage,
                    [shelf]: [
                        ...storage[shelf].slice(0, slotIndex),
                        null,
                        ...storage[shelf].slice(slotIndex + 1),
                    ],
                };
                const updatedItemLocations = { ...itemLocations };
                delete updatedItemLocations[barcode];
                return { success: true, updatedStorage, updatedItemLocations };
            }
        }
        return { success: false, message: `Item with barcode ${barcode} not found in storage.` };
    };


    const handleCommand = () => {
        switch (command) {
            case 'store':
                storeItem(barcode);
                break;
            case 'find':
                findItem(barcode);
                break;
            case 'remove':
                const removeResult = removeFromStorage(barcode, storage, itemLocations);
                if (removeResult.success) {
                    setStorage(removeResult.updatedStorage);
                    setItemLocations(removeResult.updatedItemLocations);
                    setOutput(`Item with barcode ${barcode} removed from storage.`);
                } else {
                    setOutput(removeResult.message);
                }
                break;
            default:
                setOutput('Error: Please select a command.');
        }
    };

    return (
        <div className="inventory-manager">
            <h1>Inventory Manager</h1>
            <div className="commands">
                <select value={command} onChange={(e) => setCommand(e.target.value)}>
                    <option value="">Select a command</option>
                    <option value="store">Store Item</option>
                    <option value="find">Find Item</option>
                    <option value="remove">Remove Item</option>
                </select>
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter the item barcode (item barcode (LWH)"/>
                <button onClick={handleCommand}>Execute Command</button>
            </div>
            <div className="output">{output}</div>
            <div className="storage">
                <h2>Storage Layout</h2>
                {Object.entries(storage).map(([shelf, slots]) => (
                    <div key={shelf} className={`storage-row ${shelf}`}>
                        <h3>{shelf.charAt(0).toUpperCase() + shelf.slice(1)}</h3>
                        <div className="slots">
                            {slots.map((slot, index) => (
                                <div key={index} className="slot">
                                    Slot {shelf}, Row {(index % 3) + 1},
                                    Item {Math.floor(index / 3) + 1}: {slot ? slot : 'Empty'}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <InventoryManager/>
        </div>
    );
}

export default App;
