import React, { useState } from "react";
import { Box, Heading, Textarea, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text } from "@chakra-ui/react";

const API_KEY = "2179f7eea93659d15bcc81f4aef758c6";

const Index = () => {
  const [shows, setShows] = useState("");
  const [seriesRatings, setSeriesRatings] = useState([]);
  const [movieRatings, setMovieRatings] = useState([]);
  const [titlesWithoutInfo, setTitlesWithoutInfo] = useState([]);

  const fetchRatings = async () => {
    const showList = shows.split(/[,\n]/).map((show) => show.trim());
    const ratingPromises = showList.map(async (show) => {
      const searchResponse = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(show)}`);
      const searchData = await searchResponse.json();
      if (searchData.results.length === 0) {
        setTitlesWithoutInfo((prevTitles) => [...prevTitles, show]);
        return null;
      }
      const showData = searchData.results[0];
      if (showData.media_type === "tv") {
        const showId = showData.id;
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}`);
        const detailsData = await detailsResponse.json();
        return {
          type: "series",
          title: showData.name,
          rating: showData.vote_average,
          year: showData.first_air_date.substring(0, 4),
          status: detailsData.status,
          avgRunTime: detailsData.episode_run_time[0],
          totalEpisodes: detailsData.number_of_episodes,
          seasons: detailsData.number_of_seasons,
        };
      } else if (showData.media_type === "movie") {
        return {
          type: "movie",
          title: showData.title,
          rating: showData.vote_average,
          year: showData.release_date.substring(0, 4),
        };
      }
    });

    const ratingResults = await Promise.all(ratingPromises);
    const seriesResults = ratingResults.filter((rating) => rating !== null && rating.type === "series");
    const movieResults = ratingResults.filter((rating) => rating !== null && rating.type === "movie");
    const sortedSeriesRatings = seriesResults.sort((a, b) => b.rating - a.rating);
    const sortedMovieRatings = movieResults.sort((a, b) => b.rating - a.rating);
    setSeriesRatings(sortedSeriesRatings);
    setMovieRatings(sortedMovieRatings);
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
      {seriesRatings.length > 0 && (
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
              {seriesRatings.map((show, index) => (
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
      {movieRatings.length > 0 && (
        <TableContainer marginTop="20px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Movie</Th>
                <Th>Rating</Th>
                <Th>Year</Th>
              </Tr>
            </Thead>
            <Tbody>
              {movieRatings.map((movie, index) => (
                <Tr key={index}>
                  <Td>{movie.title}</Td>
                  <Td>{movie.rating}</Td>
                  <Td>{movie.year}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {titlesWithoutInfo.length > 0 && (
        <Box marginTop="20px">
          <Text fontWeight="bold">Titles w/o Info:</Text>
          <Textarea value={titlesWithoutInfo.join("\n")} readOnly />
        </Box>
      )}
    </Box>
  );
};

export default Index;
