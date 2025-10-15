# ===== Stage 1: build (Maven + JDK)
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
# cache de dependências
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
# build da app
COPY src ./src
RUN mvn -q -DskipTests package

# ===== Stage 2: runtime (JRE leve)
FROM eclipse-temurin:21-jre
WORKDIR /app
# timezone opcional (Brasil)
ENV TZ=America/Sao_Paulo
# copiar o JAR final do stage anterior
COPY --from=build /app/target/*.jar /app/app.jar
# porta do Spring
EXPOSE 8080
# profile 'docker' (ver application-docker.properties abaixo)
ENV SPRING_PROFILES_ACTIVE=docker
ENTRYPOINT ["java","-jar","/app/app.jar"]