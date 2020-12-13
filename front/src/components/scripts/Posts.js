import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Posts(props) {
  const [search, setSearch] = useState('');

  const renderPosts = () => {
    return props.posts
      .filter((p) => p.author && p.author.startsWith(search))
      .map((p) => (
        <li key={p._id}>
          {p.author} said: {p.text}
        </li>
      ));
  };

  return (
    <div>
      <h2>Posts</h2>
      <label>
        Search by:{' '}
        <input
          type="text"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
        ></input>
      </label>

      <ul>{renderPosts()}</ul>
    </div>
  );
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
