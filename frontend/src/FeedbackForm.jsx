import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [userName, setUserName] = useState("");

  // Fetch questions on component load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/questions");
        setQuestions(data);
        const initialResponses = {};
        data.forEach((q) => {
          initialResponses[q.id] = ""; // Initialize responses with empty values
        });
        setResponses(initialResponses);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  const handleChange = (e, questionId) => {
    setResponses({
      ...responses,
      [questionId]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedResponses = Object.entries(responses).map(
        ([question_id, user_response]) => ({
          question_id,
          user_response,
        })
      );
      await axios.post("http://localhost:5000/api/responses", {
        user_name: userName,
        responses: formattedResponses,
      });
      alert("Feedback submitted successfully!");
      setResponses({});
      setUserName(""); // Clear user name input after submit
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-500 ease-in-out hover:scale-105">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          We Value Your Feedback
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-4">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300 ease-in-out hover:border-indigo-400"
              placeholder="Your name"
              required
            />
          </div>
          {questions.map((question) => (
            <div key={question.id}>
              <label className="block text-xl font-medium text-gray-700 mb-4">
                {question.question_text}
              </label>
              <textarea
                value={responses[question.id] || ""}
                onChange={(e) => handleChange(e, question.id)}
                rows="5"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300 ease-in-out hover:border-indigo-400"
                placeholder="Your response..."
              />
            </div>
          ))}
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-indigo-700 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
