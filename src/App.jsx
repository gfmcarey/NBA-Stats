import * as React from 'react';

//creates a costum hook for us that combines the useState hook with the useEffect hook to store the 
//value of searchTerm locally (use abstracted "value" for reusability). We pass in a flexible key from
//the outside so that it doesn't run with an outdated key (also called stale) or our old key 
const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
 );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  
  //uses stored value, if a value exists, to set initial state of the searchTerm
  /*
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React'
    );
  */
  /*
  React’s useEffect Hook takes two arguments: The first argument is a function that runs 
  our side-effect. In our case, the side-effect stores searchTerm into the browser’s local 
  storage. The second argument is a dependency array of variables. If one of these variables 
  changes, the function for the side-effect is called. In our case, the function is called 
  every time the searchTerm changes (e.g. when a user types into the HTML input field). 
  In addition, it’s also called initially when the component renders for the first time.
  
  React.useEffect(() =>{
    localStorage.setItem('search', searchTerm)
  }, [searchTerm]);
  */
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    //stores value of search term in local storage (as 'search') to be remembered when the site is opened again
    //localStorage.setItem('search', event.target.value)
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id = "search"
        label = "Search"
        value={searchTerm}
        onInputChange={handleSearch}
      />

      <hr />

      <List list = {searchedStories} />
    </div>
  );
};
//adding shorthand version of React Fragments by replacing <div> with <>
const InputWithLabel = ({ id, label, value, type = 'text', onInputChange}) => (
  <>
    <label htmlFor={id}>{label}</label>
    &nbsp;
    <input id={id} type={type} value={value} onChange={onInputChange}/>
  </>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

/*
// Variation 1: Nested Destructuring: The nested destructuring helps us to gather all the needed 
information of the item object in the function signature for its immediate usage in the component’s elements. 

const Item = ({
  item: {
    title,
    url,
    author,
    num_comments,
    points,
  },
}) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

// Variation 2: Spread and Rest Operators: In this final variation, the rest operator 
is used to destructure the objectID from the rest of the item object. Afterward, the 
item is spread with its key/values pairs into the Item component. While this final 
variation is very concise, it comes with advanced JavaScript features that may be unknown to some.
// Final Step

const List = ({ list }) => (
  <ul>
    {list.map(({ objectID, ...item }) => (
      <Item key={objectID} {...item} />
    ))}
  </ul>
);

const Item = ({ title, url, author, num_comments, points }) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);
*/

export default App;
