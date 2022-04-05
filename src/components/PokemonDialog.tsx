import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export interface IPokemonResult {
  status: number;
  name: string;
  description: string;
  sprite: string;
}

interface IPokemonResultProps {
  pokemonInfo: IPokemonResult
}

export function PokemonDialog({ pokemonInfo }: IPokemonResultProps) {
  return (<>
    <br/>
    <Card sx={{ display: 'flex', maxWidth:500 }}>
      <CardMedia data-testid="pokemon_image"
        component="img"
        alt={pokemonInfo.name}
        sx={{ maxWidth: 75 }}
        image={pokemonInfo.sprite}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" data-testid="pokemon_name">
            {pokemonInfo.name.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary" data-testid="pokemon_description">
            {pokemonInfo.description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  </>)
}
