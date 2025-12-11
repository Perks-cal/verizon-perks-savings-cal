FROM openjdk:17-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests

EXPOSE 8081
CMD ["java", "-jar", "target/perksapi-0.0.1-SNAPSHOT.jar"]
