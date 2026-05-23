import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.tools.search_tools import travel_search_tool

def get_travel_agent():
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    tools = [travel_search_tool]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Eres un experto planificador de viajes. Tu objetivo es crear itinerarios detallados, "
                   "optimizando el presupuesto y considerando el clima actual. "
                   "Siempre verifica precios reales de vuelos y hoteles usando tus herramientas."),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)
