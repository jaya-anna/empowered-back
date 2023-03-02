import React from 'react';

function CreatePost() {
  return (
    <div>
      <h1>Create Post</h1>
      <form action='' method='' >
        <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" />
        <label htmlFor="content">Content:</label>
            <textarea id="content" name="content" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreatePost;
