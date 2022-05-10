import { useState, useCallback } from "react";

import NumberField from "components/NumberField";
import RoomAllocation from "views/RoomAllocation";

import styles from './App.css';

const App = () => {
    const [ roomCount, setRoomCount ] = useState(3);
    const [ peopleCount, setPeopleCount ] = useState(10);

    const updateRoomCount = useCallback(
        event => setRoomCount(parseInt(event.target.value, 10)), []
    );

    const updatePeopleCount = useCallback(
        event => setPeopleCount(parseInt(event.target.value, 10)), []
    );

    const handleChange = useCallback(result => {
        console.log('result', result);
    }, []);

    return (
        <main>
            <article className={styles.condition}>
                <div>
                    人數
                    <NumberField
                        min={1}
                        value={peopleCount}
                        onChange={updatePeopleCount}
                    />
                </div>
                <div>
                    房數
                    <NumberField
                        min={1}
                        value={roomCount}
                        onChange={updateRoomCount}
                    />
                </div>
            </article>
            <RoomAllocation
                /* reset the allocator with count change */
                key={`${roomCount}_${peopleCount}`}
                className={styles.allocator}
                room={roomCount}
                guest={peopleCount}
                onChange={handleChange}
            />
        </main>
    );
}

export default App;
