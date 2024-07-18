
const Header = (props) => {
  return <h1>{props.courses.name}</h1>
}

const Part = (props) => {
  return (
    <>
      <p>
      {props.part}: {props.exercises}
      </p>
    </>
    
  )
}

const Content = (props) => {
  console.log('props', props);
  return (
    <>
      {props.courses.parts.map((part, i) => 
        <Part key={i} part={part.name} exercises={part.exercises}/>
      )}
    </>
  );
}

const Total = (props) => { 
  let parts = props.courses.parts;
  let total = parts.reduce((a, b) => a + b.exercises, 0)

  return <p>Number of exercises {total} </p>;
}

const Course = (props) => {
  return (
    <div>
      <Header courses={props.courses}/>
      <Content courses={props.courses}/>
      <Total courses={props.courses}/>
    </div>
  )
}

export default Course