# Use Gradle image for building
FROM gradle:8.4.0-jdk17 AS build

WORKDIR /app

# Cache dependencies: copy only Gradle config first
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Download dependencies only (no source yet)
RUN ./gradlew dependencies --no-daemon || return 0

# Now copy source code (only after dependencies)
COPY src ./src

# Build the bootJar only (skip tests for speed)
RUN ./gradlew clean bootJar -x test --no-daemon

# Runtime stage with smaller image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/build/libs/vptsv1-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/vptsv1-0.0.1-SNAPSHOT.jar"]
