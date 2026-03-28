from langgraph.graph import END, START, StateGraph

from models import Board, CharacterId, MoveResponse
from prompts.characters import CHARACTERS

from .nodes import call_llm, compute_move, fallback_commentary
from .state import GraphState


def build_graph() -> StateGraph:
    graph = StateGraph(GraphState)

    graph.add_node("compute_move", compute_move)
    graph.add_node("call_llm", call_llm)
    graph.add_node("fallback_commentary", fallback_commentary)

    graph.add_edge(START, "compute_move")
    graph.add_edge("compute_move", "call_llm")
    graph.add_edge("call_llm", "fallback_commentary")
    graph.add_edge("fallback_commentary", END)

    return graph


move_graph = build_graph().compile()


def get_cpu_move(
    board: Board,
    character: CharacterId,
    player_piece: str,
    cpu_piece: str,
) -> MoveResponse:
    difficulty = CHARACTERS[character]["difficulty"]
    result = move_graph.invoke(
        {
            "board": board,
            "character": character,
            "difficulty": difficulty,
            "player_piece": player_piece,
            "cpu_piece": cpu_piece,
            "move": None,
            "commentary": "",
        }
    )
    return MoveResponse(move=result["move"], commentary=result["commentary"])
