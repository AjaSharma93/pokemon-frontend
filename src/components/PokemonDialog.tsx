import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export interface IPokemonResult {
    status: number;
    name: string;
    description: string;
    sprite: string;
  }

  interface IPokemonResultProps{
      pokemonInfo:IPokemonResult
  }

  export function PokemonDialog({pokemonInfo}:IPokemonResultProps) {
    return (<>
    <Card sx={{ maxWidth: 400 }} style={{margin:"0 auto"}}>
      <CardMedia data-testid="pokemon_image"
        component="img"
        alt={pokemonInfo.name}
        height="auto"
        image={pokemonInfo.sprite}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" data-testid="pokemon_name">
          {pokemonInfo.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" data-testid="pokemon_description">
          {pokemonInfo.description}
        </Typography>
      </CardContent>
    </Card>
    </>)
}
