import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.handleClick}>
    {props.text}
  </button>
}

const Stat = (props) => {
  return (
    <p>
      has {props.votes} votes
    </p>
  );
}

const Header = (props) => {
  return <h1>{props.text}</h1>
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const upVote = (votes, selected) => {
    let updated = [...votes];
    updated[selected] += 1;

    return setVotes(updated);
  }

  const random = (max) => {
    return Math.floor(Math.random() * max);
  }

  const findMostIndex = (votes) => {
    let most = 0;

    votes.forEach((_, index) => {
      if (votes[index] > votes[most]) {
        most = index;
      } 
    });

    return most;
  }
  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);
  const most = findMostIndex(votes);

  return (
    <div>
      <Header text={'Anecdote of the day'}/>
      <p>
        {anecdotes[selected]}
      </p>
      <Button text={'next anecdote'} handleClick={() => setSelected(random(anecdotes.length))}/>
      <Stat votes={votes[selected]}/>
      <Button text={'vote for this one'} handleClick={() => upVote(votes, selected)}/>
      <Header text={'Anecdote with most votes'}/>
      <p>{anecdotes[most]}</p>
      <Stat votes={votes[most]}/>
    </div>
  )
}

export default App