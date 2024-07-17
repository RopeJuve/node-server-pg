// Import utility functions
import {
  getResourceId,
  processBodyFromRequest,
  returnErrorWithMessage,
} from "./utils.js";
import { pool } from "./db.js";

export const createPost = async (req, res) => {
  try {
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, "Body is required");
    const parsedBody = JSON.parse(body);
    console.log("Here we have access to the body: ", parsedBody);
    const result = await pool.query(
      "INSERT INTO posts (title,author, content) VALUES ($1, $2, $3) RETURNING *",
      [parsedBody.title, parsedBody.author, parsedBody.content]
    );

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows[0]));
  } catch (error) {
    returnErrorWithMessage(res);
  }
};

export const getPosts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    console.log("Here we have access to the result: ", result);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    returnErrorWithMessage(res);
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    console.log("Here we have access to the ID: ", id);
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return returnErrorWithMessage(res, 404, "Post not found");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows[0]));
  } catch (error) {
    returnErrorWithMessage(res);
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    console.log("Here we have access to the ID: ", id);
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, "Body is required");
    const parsedBody = JSON.parse(body);
    console.log("Here we have access to the body: ", parsedBody);
    const result = await pool.query(
      "UPDATE posts SET title = $1, author = $2, content = $3 WHERE id = $4 RETURNING *",
      [parsedBody.title, parsedBody.author, parsedBody.content, id]
    );
    if (result.rows.length === 0)
      return returnErrorWithMessage(res, 404, "Post not found");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows[0]));
  } catch (error) {
    returnErrorWithMessage(res);
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    console.log("Here we have access to the ID: ", id);
    const postForDeleting = await pool.query(
      "DELETE FROM posts WHERE id = $1",
      [id]
    );
    if (postForDeleting.rowCount === 0)
      return returnErrorWithMessage(res, 404, "Post not found");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Post deleted" }));
  } catch (error) {
    returnErrorWithMessage(res);
  }
};
