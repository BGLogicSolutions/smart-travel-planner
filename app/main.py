import streamlit as st
from dotenv import load_dotenv
from app.core.agent import get_travel_agent

load_dotenv()

st.set_page_config(page_title="Smart Travel Planner", page_icon="✈️")

st.title("🌍 Smart Travel Planner AI")
st.markdown("Planifica tu viaje perfecto con datos en tiempo real.")

with st.sidebar:
    st.header("Preferencias")
    budget = st.selectbox("Presupuesto", ["Económico", "Moderado", "Lujo"])
    days = st.number_input("Duración (días)", min_value=1, max_value=30, value=5)
    interests = st.multiselect("Intereses", ["Cultura", "Gastronomía", "Aventura", "Relax"])

destination = st.text_input("¿A dónde quieres ir?", placeholder="Ej: Tokio, Japón")

if st.button("Generar Itinerario Mágico"):
    if destination:
        with st.spinner(f"Investigando {destination}..."):
            agent = get_travel_agent()
            query = (f"Planifica un viaje a {destination} por {days} días. "
                     f"Presupuesto: {budget}. Intereses: {', '.join(interests)}.")
            
            response = agent.invoke({"input": query})
            st.success("¡Itinerario Generado!")
            st.markdown(response["output"])
    else:
        st.warning("Por favor, ingresa un destino.")
