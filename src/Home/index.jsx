import * as React from 'react';
import axios from 'axios';

import { SearchForm } from '../SearchForm/index.jsx';
import { List } from '../List/index.jsx';
import { useStorageState } from './useStorageState.jsx';
import { storiesReducer } from './storiesReducer.jsx';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';


const Home = () => {
    const [searchTerm, setSearchTerm] = useStorageState(
      'search',
      'React'
    );
  
    const [url, setUrl] = React.useState(
      `${API_ENDPOINT}${searchTerm}`
    );
  
    const [stories, dispatchStories] = React.useReducer(
      storiesReducer,
      { data: [], isLoading: false, isError: false }
    );
  
    const handleFetchStories = React.useCallback(async () => {
      dispatchStories({ type: 'STORIES_FETCH_INIT' });
  
      try {
        const result = await axios.get(url);
  
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
      } catch {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
      }
    }, [url]);
  
    React.useEffect(() => {
      handleFetchStories();
    }, [handleFetchStories]);
  
    const handleRemoveStory = (item) => {
      dispatchStories({
        type: 'REMOVE_STORY',
        payload: item,
      });
    };
  
    const handleSearchInput = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSearchSubmit = (event) => {
      setUrl(`${API_ENDPOINT}${searchTerm}`);
  
      event.preventDefault();
    };
  
    return(
      <div className='home'>
        <SearchForm
            searchTerm={searchTerm}
            onSearchInput={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}
          />
  
          <hr />
  
          {stories.isError && <p>Something went wrong ...</p>}
  
          {stories.isLoading ? (
            <p>Loading ...</p>
          ) : (
            <List list={stories.data} onRemoveItem={handleRemoveStory} />
          )}
      </div>
    );
  };

  export { Home };