import React, { useState } from "react";
import { Box, Heading, Textarea, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";

const API_KEY = "YOUR_OMDB_API_KEY";

const Index = () => {
  const [shows, setShows] = useState("");
  const [ratings, setRatings] = useState([]);

  const fetchRatings = async () => {
    const showList = shows.split(/[,\n]/).map((show) => show.trim());
    const ratingPromises = showList.map(async (show) => {
      const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(show)}&apikey=${API_KEY}`);
      const data = await response.json();
      return { title: data.Title, rating: data.imdbRating };
    });

    const ratingResults = await Promise.all(ratingPromises);
    const sortedRatings = ratingResults.sort((a, b) => b.rating - a.rating);
    setRatings(sortedRatings);
  };

  return (
    <Box maxWidth="600px" margin="auto" padding="20px">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
        Netflix Shows Rating
      </Heading>
      <Textarea value={shows} onChange={(e) => setShows(e.target.value)} placeholder="Enter Netflix shows, separated by comma or newline" marginBottom="20px" />
      <Button colorScheme="blue" onClick={fetchRatings}>
        Get Ratings
      </Button>
      {ratings.length > 0 && (
        <TableContainer marginTop="20px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Show</Th>
                <Th>Rating</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ratings.map((show, index) => (
                <Tr key={index}>
                  <Td>{show.title}</Td>
                  <Td>{show.rating}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Index;
