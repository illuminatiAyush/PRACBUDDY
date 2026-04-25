
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

int main() {
    int fd;
    char buffer[50];

    // Open file
    fd = open("test.txt", O_RDONLY);

    // Read file
    read(fd, buffer, sizeof(buffer));

    // Write to output
    write(1, buffer, sizeof(buffer));

    // Print process ID
    printf("\nPID: %d\n", getpid());
    printf("PPID: %d\n", getppid());

    // Close file
    close(fd);
    return 0;
}
