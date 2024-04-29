function make-icons() {
    if [ $# -ne 1 ]; then
        echo "Usage: make-icons <input>"
        return 1
    fi

    node make-web-icons.js "$1"
}