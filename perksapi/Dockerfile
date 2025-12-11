
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies to cache them
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the app without running tests
RUN ./mvnw clean package -DskipTests

# Expose port (Spring Boot default)
EXPOSE 8081

# Automatically find the generated JAR and run it
CMD java -jar target/*.jar
