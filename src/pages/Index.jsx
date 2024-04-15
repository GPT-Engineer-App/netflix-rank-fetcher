import React, { useState } from "react";
import { Box, Heading, Textarea, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text } from "@chakra-ui/react";

const API_KEY = "2179f7eea93659d15bcc81f4aef758c6";

const Index = () => {
  const [shows, setShows] = useState("");
  const [ratings, setRatings] = useState([]);
  const [showsWithoutInfo, setShowsWithoutInfo] = useState([]);

  const fetchRatings = async () => {
    const showList = shows.split(/[,\n]/).map((show) => show.trim());
    const ratingPromises = showList.map(async (show) => {
      const searchResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(show)}`);
      const searchData = await searchResponse.json();
      if (searchData.results.length > 0) {
        const showData = searchData.results[0];
        const showId = showData.id;
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}`);
        const detailsData = await detailsResponse.json();
        return {
          title: showData.name,
          rating: showData.vote_average,
          year: showData.first_air_date.substring(0, 4),
          status: detailsData.status,
          avgRunTime: detailsData.episode_run_time[0],
          totalEpisodes: detailsData.number_of_episodes,
          seasons: detailsData.number_of_seasons,
        };
      } else {
        setShowsWithoutInfo((prevShows) => [...prevShows, show]);
        return null;
      }
    });

    const ratingResults = await Promise.all(ratingPromises);
    const filteredRatings = ratingResults.filter((rating) => rating !== null);
    const sortedRatings = filteredRatings.sort((a, b) => b.rating - a.rating);
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
      {(ratings.length > 0 || showsWithoutInfo.length > 0) && (
        <TableContainer marginTop="20px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Show</Th>
                <Th>Rating</Th>
                <Th>Year</Th>
                <Th>Status</Th>
                <Th>Avg Run Time</Th>
                <Th>Total Episodes</Th>
                <Th>Seasons</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ratings.map((show, index) => (
                <Tr key={index}>
                  <Td>{show.title}</Td>
                  <Td>{show.rating}</Td>
                  <Td>{show.year}</Td>
                  <Td>{show.status}</Td>
                  <Td>{show.avgRunTime ? `${show.avgRunTime} min` : ""}</Td>
                  <Td>{show.totalEpisodes}</Td>
                  <Td>{show.seasons}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {showsWithoutInfo.length > 0 && (
        <Box marginTop="20px">
          <Text fontWeight="bold">Shows w/o Info:</Text>
          <Textarea value={showsWithoutInfo.filter((show) => show.trim() !== "").join("\n")} readOnly />
        </Box>
      )}
    </Box>
  );
};

export default Index;
