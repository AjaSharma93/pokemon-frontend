import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './App.css';
import { ErrorDialog, IErrorResult } from './components/ErrorDialog';
import { IPokemonResult, PokemonDialog } from './components/PokemonDialog';

// Using client side session storage caching to reduce the number of API calls to the server
const SESSION_CACHE_ITEMS_NUMBER = 100;
const SESSION_CACHE_NAME = 'pokemonInfo';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonInfo, setPokemonInfo] = useState<IPokemonResult | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<IErrorResult | undefined>(undefined);
  // For any error in the input field for pokemonName
  const [errorText, setErrorText] = useState<string>('');
  const [disabled, setDisabled] = useState(false);

  function handlePostForm(event: React.SyntheticEvent) {
    event.preventDefault();
    setPokemonInfo(undefined);
    setErrorMessage(undefined);
    setDisabled(true);
    
    if (pokemonName.length == 0) return setErrorText('Please enter a pokemon name.');
    let pokemonInfo = getPokemonInfoFromCache(pokemonName);
    if (pokemonInfo) {
      setDisabled(false);
      return setPokemonInfo(pokemonInfo);
    }
    
    fetch(`${process.env.REACT_APP_SERVER_URL}/pokemon/${pokemonName}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          setErrorMessage(body ?? "Not 200 response");
        } else {
          setPokemonInfo(body);
          // Cache the response in sessionStorage
          setPokemonInfoInCache(body);
        }
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setDisabled(false);
      });
  }

  return (
    <Container>
      <br />
      <Form onSubmit={handlePostForm}>
        <Row>
          <Form.Group className="mb-3" controlId="pokemonName">
            <Col xs="12" sm="6" md="4" lg="4">
              <Form.Label>Pokemon Search</Form.Label>
              <Form.Control type="text" placeholder="Enter the pokemon's name" value={pokemonName} onChange={(e) => {
                setPokemonName(e.target.value)
              }} />
              <Form.Control.Feedback data-testid="error_name" type={(errorText!==null)?"invalid":"valid"}>{errorText}</Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Col xs="12" sm="6" md="4" lg="4">
            <Button id="submitButton" variant="success" type="submit" aria-label="search" disabled={disabled}>
              <FontAwesomeIcon icon={faSearch} /> Search
            </Button>
          </Col>
        </Row>
      </Form>
      <div style={{ padding: "5px" }}>
        {pokemonInfo && <PokemonDialog pokemonInfo={pokemonInfo} />}
        {errorMessage && <ErrorDialog errorMessage={errorMessage} />}
      </div>
    </Container>
  )
}

// setter and getter methods for pokemon information
function setPokemonInfoInCache(body: IPokemonResult) {
  let pokemonInfoStorage = sessionStorage.getItem(SESSION_CACHE_NAME) ?? '[]';
  let pokemonInfo = JSON.parse(pokemonInfoStorage);
  if (pokemonInfo.length === SESSION_CACHE_ITEMS_NUMBER) pokemonInfo.pop();
  pokemonInfo.push(body);
  sessionStorage.setItem(SESSION_CACHE_NAME, JSON.stringify(pokemonInfo));
}

function getPokemonInfoFromCache(pokemonName: string) {
  let pokemonInfoStorage = sessionStorage.getItem(SESSION_CACHE_NAME) ?? '[]';
  let pokemonInfo = JSON.parse(pokemonInfoStorage);
  return (pokemonInfo.filter((p: any) => p.name === pokemonName)?.[0]) ?? null;
}

export default App;
