
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

# Pre-download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the Spring Boot app
RUN ./mvnw clean package -DskipTests

# Expose default port
EXPOSE 8080

# Run the jar using Render's PORT environment variable
CMD ["sh", "-c", "java -jar -Dserver.port=${PORT} target/perksapi-0.0.1-SNAPSHOT.jar"]
