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

const initialStories = [
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

const getAsyncStories = () =>
  //short hand version of a promise
  //Promise.resolve({ data: { stories: initialStories } });
  //set a delay of two seconds when resolving the data
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const storiesReducer = (state, action) => {
  switch(action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error()
  }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  
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
  // A
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React')

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  React.useEffect(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}${searchTerm}`) // B
      .then((response) => response.json()) // C
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits, // D
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [searchTerm]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    //stores value of search term in local storage (as 'search') to be remembered when the site is opened again
    //localStorage.setItem('search', event.target.value)
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id = "search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {/*
      In JavaScript, a true && 'Hello World' always evaluates to ‘Hello World’. 
      A false && 'Hello World' always evaluates to false. In React, we can use 
      this behaviour to our advantage. If the condition is true, the expression 
      after the logical && operator will be the output. If the condition is false, 
      React ignores it and skips the expression. Using expession && JSX is more 
      concise than using expression ? JSX : null.
      */}
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
//adding shorthand version of React Fragments by replacing <div> with <>
/*
(A) First, create a ref with React’s useRef Hook. This ref object is a persistent value 
which stays intact over the lifetime of a React component. It comes with a property called 
current, which, in contrast to the ref object, can be changed.
(B) Second, the ref is passed to the element’s JSX-reserved ref attribute and thus element 
instance gets assigned to the changeable current property.
(C) Third, opt into React’s lifecycle with React’s useEffect Hook, performing the focus 
on the element when the component renders (or its dependencies change).
(D) And fourth, since the ref is passed to the element’s ref attribute, its current 
property gives access to the element. Execute its focus programmatically as a side-effect, 
but only if isFocused is set and the current property is existent.
*/
const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  // A
  const inputRef = React.useRef();

  // C
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
     <label htmlFor={id}>{children}</label>
      &nbsp;
       {/* B */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

//In contrast, the second and more popular solution is to use an inline arrow function, 
//which allows us to sneak in arguments like the item:
const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
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
