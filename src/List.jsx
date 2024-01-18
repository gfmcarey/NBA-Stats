import * as React from 'react';

import { MdCancel } from "react-icons/md";
import { IconContext } from "react-icons";

const List = ({ list, onRemoveItem }) => (
    <ul>
      {list.map((item) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
  
  const Item = ({ item, onRemoveItem }) => (
    <li className="item">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button
          type="button"
          onClick={() => onRemoveItem(item)}
          className="button button_small"
        > 
          {/* Have to call IconContext.Provider to edit atributes  */}
          <IconContext.Provider value={{ size: "20px"}}>
            <MdCancel/>
          </IconContext.Provider>
          { /* <Check height="18px" width="18px" /> */ }
        </button>
      </span>
    </li>
  );

export { List };