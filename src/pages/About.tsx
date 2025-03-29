import { useAppSelector, useAppDispatch } from '../hooks'; 
import { incremented, amountAdded } from '../features/counterSlice';

function About() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h2>About</h2>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(incremented())}>Increment</button>
      <button onClick={() => dispatch(amountAdded(5))}>Add 5</button>
    </div>
  );
}

export default About;