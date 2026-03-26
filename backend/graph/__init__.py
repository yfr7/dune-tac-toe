from langgraph.graph import END, START, StateGraph

from models import Board, CharacterId, MoveResponse

from .nodes import call_llm, fallback_move, parse_response
from .state import GraphState


def build_graph() -> StateGraph:
    graph = StateGraph(GraphState)

    graph.add_node("call_llm", call_llm)
    graph.add_node("parse_response", parse_response)
    graph.add_node("fallback_move", fallback_move)

    graph.add_edge(START, "call_llm")
    graph.add_edge("call_llm", "parse_response")
    graph.add_edge("parse_response", "fallback_move")
    graph.add_edge("fallback_move", END)

    return graph


move_graph = build_graph().compile()


def get_cpu_move(
    board: Board,
    character: CharacterId,
    player_piece: str,
    cpu_piece: str,
) -> MoveResponse:
    result = move_graph.invoke(
        {
            "board": board,
            "character": character,
            "player_piece": player_piece,
            "cpu_piece": cpu_piece,
            "raw_response": "",
            "move": None,
            "commentary": "",
        }
    )
    return MoveResponse(move=result["move"], commentary=result["commentary"])
