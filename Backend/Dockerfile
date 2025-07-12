# Stage 1: Build the app
FROM gradle:8.2.1-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle build --no-daemon

# Stage 2: Run the app
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
