import { useState } from 'react'

const Header = (props) => {
  return <h1>{props.text}</h1>;
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  );
}

const StatisticLine = (props) => {
  if (props.text === 'positive') {
    let total = props.values[3];
    let goods = props.values[0];

    let positive = (goods / total) ? (goods / total) : 0;
    positive = (positive === 1 ? 100 : positive);

    return <tr>{props.text} <td>{positive}</td>%</tr>

  } else if (props.text === 'average') {
    let score = props.values[0] - props.values[2];
    let total = props.values[3];
    let average = (score / total) ? (score / total) : 0;
    
    return <tr>{props.text} <td>{average}</td></tr>

  } else {
    return <tr>{props.text} <td>{props.value}</td></tr>
  }
}

const Statistics = (props) => {
  if (props.values[3] === 0) {
    return <p>No feedback given</p>
    
  } else {
    return (
      <>
        <table>
          <StatisticLine text={'good'} value={props.values[0]}/>
          <StatisticLine text={'neutral'} value={props.values[1]}/>
          <StatisticLine text={'bad'} value={props.values[2]}/>
          <StatisticLine text={'all'} value={props.values[3]}/>
          <StatisticLine text={'average'} values={props.values}/>
          <StatisticLine text={'positive'} values={props.values}/>
        </table>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;

  return (
    <div>
      <Header text={'give feedback'}/>
      <Button text={'good'} handleClick={() => setGood(good + 1)}/>
      <Button text={'neutral'} handleClick={() => setNeutral(neutral + 1)}/>
      <Button text={'bad'} handleClick={() => setBad(bad + 1)}/>
      <Header text={'statistics'}/>
      <Statistics values={[good, neutral, bad, all]}/>
    </div>
  )
}

export default App